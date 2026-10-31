import { describe, test, expect } from "vitest";
import { validationResult } from "express-validator";
import { loginValidator, registerValidator } from "../../../src/middleware/validators/authValidator.js";

async function validateBody(validators, body) {
    const req = { body };

    for (const validator of validators) {
        await validator.run(req);
    }

    return {
        req,
        errors: validationResult(req).array(),
    };
}

describe("registerValidator", () => {
    test("accepts valid registration data and sanitizes username and email", async () => {
        const { req, errors } = await validateBody(registerValidator, {
            username: "  test_user  ",
            email: "  TEST@EXAMPLE.COM  ",
            password: "Aa1!aaaa",
        });

        expect(errors).toHaveLength(0);
        expect(req.body.username).toBe("test_user");
        expect(req.body.email).toBe("test@example.com");
        expect(req.body.password).toBe("Aa1!aaaa");
    });

    test.for([
        { field: "username", message: "Invalid username" },
        { field: "email", message: "Invalid email" },
        { field: "password", message: "Invalid password" },
    ])("rejects a missing $field", async ({ field, message }) => {
        const body = {
            username: "test_user",
            email: "test@example.com",
            password: "Aa1!aaaa",
        };
        delete body[field];

        const { errors } = await validateBody(registerValidator, body);

        expect(errors.some((error) => error.path === field && error.msg === message)).toBe(true);
    });

    test.for([
        { username: 123, message: "Invalid username" },
        { username: "", message: "Username is required." },
        { username: "   ", message: "Username is required." },
        { username: "ab", message: "Username must be 3 to 20 characters long." },
        { username: "a".repeat(21), message: "Username must be 3 to 20 characters long." },
        { username: "valid-name", message: "Username can only contain letters, numbers, and underscores." },
    ])("rejects username $username", async ({ username, message }) => {
        const { errors } = await validateBody(registerValidator, {
            username,
            email: "test@example.com",
            password: "Aa1!aaaa",
        });

        expect(errors.some((error) => error.path === "username" && error.msg === message)).toBe(true);
    });

    test.for([
        { username: "abc", description: "the minimum length" },
        { username: "a".repeat(20), description: "the maximum length" },
    ])("accepts a username at $description", async ({ username }) => {
        const { errors } = await validateBody(registerValidator, {
            username,
            email: "test@example.com",
            password: "Aa1!aaaa",
        });

        expect(errors).toHaveLength(0);
    });

    test("rejects a non-string email", async () => {
        const { errors } = await validateBody(registerValidator, {
            username: "test_user",
            email: 123,
            password: "Aa1!aaaa",
        });

        expect(errors.some((error) => error.path === "email" && error.msg === "Invalid email")).toBe(true);
    });

    test.for([
        { email: "", message: "Email is required" },
        { email: "   ", message: "Email is required" },
        { email: "a".repeat(243) + "@example.com", message: "Email is too long." },
        { email: "not-an-email", message: "Invalid email format." },
    ])("rejects email $email", async ({ email, message }) => {
        const { errors } = await validateBody(registerValidator, {
            username: "test_user",
            email,
            password: "Aa1!aaaa",
        });

        expect(errors.some((error) => error.path === "email" && error.msg === message)).toBe(true);
    });

    test("rejects a password that is not a string", async () => {
        const { errors } = await validateBody(registerValidator, {
            username: "test_user",
            email: "test@example.com",
            password: 12345678,
        });

        expect(errors.some((error) => error.path === "password" && error.msg === "Invalid password")).toBe(true);
    });

    test.for([
        { password: "", message: "Password is required." },
        { password: "Aa1!aaa", message: "Password must be 8 to 64 characters long." },
        { password: "Aa1!" + "a".repeat(61), message: "Password must be 8 to 64 characters long." },
        { password: "aa1!aaaa", message: "Password must contain at least one uppercase letter." },
        { password: "AA1!AAAA", message: "Password must contain at least one lowercase letter." },
        { password: "Aa!aaaaa", message: "Password must contain at least one number." },
        { password: "Aa1aaaaa", message: "Password must contain at least one special character." },
    ])("rejects password $password", async ({ password, message }) => {
        const { errors } = await validateBody(registerValidator, {
            username: "test_user",
            email: "test@example.com",
            password,
        });

        expect(errors.some((error) => error.path === "password" && error.msg === message)).toBe(true);
    });

    test.for([
        { password: "Aa1!aaaa", description: "the minimum length" },
        { password: "Aa1!" + "a".repeat(60), description: "the maximum length" },
    ])("accepts a password at $description", async ({ password }) => {
        const { errors } = await validateBody(registerValidator, {
            username: "test_user",
            email: "test@example.com",
            password,
        });

        expect(errors).toHaveLength(0);
    });
});

describe("loginValidator", () => {
    test("accepts valid login data and trims the identifier", async () => {
        const { req, errors } = await validateBody(loginValidator, {
            identifier: "  test_user  ",
            password: "x",
        });

        expect(errors).toHaveLength(0);
        expect(req.body.identifier).toBe("test_user");
        expect(req.body.password).toBe("x");
    });

    test.for([
        { field: "identifier", message: "Invalid username or email." },
        { field: "password", message: "Password is required." },
    ])("rejects a missing $field", async ({ field, message }) => {
        const body = {
            identifier: "test_user",
            password: "x",
        };
        delete body[field];

        const { errors } = await validateBody(loginValidator, body);

        expect(errors.some((error) => error.path === field && error.msg === message)).toBe(true);
    });

    test.for([
        { identifier: 123, message: "Invalid username or email." },
        { identifier: "", message: "Username or email is required." },
        { identifier: "   ", message: "Username or email is required." },
        { identifier: "a".repeat(255), message: "Email or username is too long." },
    ])("rejects identifier $identifier", async ({ identifier, message }) => {
        const { errors } = await validateBody(loginValidator, {
            identifier,
            password: "x",
        });

        expect(errors.some((error) => error.path === "identifier" && error.msg === message)).toBe(true);
    });

    test("accepts an identifier at the maximum length", async () => {
        const { errors } = await validateBody(loginValidator, {
            identifier: "a".repeat(254),
            password: "x",
        });

        expect(errors).toHaveLength(0);
    });

    test.for([
        { password: "", message: "Password is required." },
        { password: 123, message: "Invalid password." },
        { password: "a".repeat(129), message: "Password is too long." },
    ])("rejects password $password", async ({ password, message }) => {
        const { errors } = await validateBody(loginValidator, {
            identifier: "test_user",
            password,
        });

        expect(errors.some((error) => error.path === "password" && error.msg === message)).toBe(true);
    });

    test("accepts a login password at the maximum length", async () => {
        const { errors } = await validateBody(loginValidator, {
            identifier: "test_user",
            password: "a".repeat(128),
        });

        expect(errors).toHaveLength(0);
    });
});
