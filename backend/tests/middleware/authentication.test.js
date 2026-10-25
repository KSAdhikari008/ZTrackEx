import { afterEach, describe, test, expect, vi } from "vitest";
import { COOKIE_NAME } from "../../src/config/cookie.js";
import jwt from "jsonwebtoken";
import { User } from "../../src/models/user.model.js";

// Set the test secret before importing the middleware so it uses the test secret instead of the production secret.
process.env.JWT_SECRET = 'text-jwt-secret'
import { authenticate } from "../../src/middleware/auth.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("authenticate middleware", () => {
  test("return 401 when auth cookie is missing", async () => {
    const req = { cookies: {} };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "User is not logged in.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("return 401 when auth cookie is invalid or malformed", async () => {

    const req = { cookies: { [COOKIE_NAME]: "invalid-token" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Session expired or invalid.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("return 401 when auth cookie is expired", async () => {
    const expiredToken = jwt.sign(
      { id: 'user123' },
        process.env.JWT_SECRET,
      { expiresIn: -1 }
    )
    const req = { cookies: { [COOKIE_NAME]: expiredToken } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Session expired or invalid.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("return 401 when token is valid but user is not found", async ()=>{
    const select = vi.fn().mockResolvedValue(null)
    const findById = vi.spyOn(User, "findById").mockReturnValue({select})
    const validToken = jwt.sign(
      {id: "user123"},
      process.env.JWT_SECRET
    )
    const req ={ cookies: { [COOKIE_NAME]: validToken }}
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }
    const next = vi.fn()

    await authenticate(req,res,next)

    expect(select).toHaveBeenCalledWith("username email")
    expect(findById).toHaveBeenCalledWith("user123")
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({message: "User is not logged in."})
    expect(next).not.toHaveBeenCalled()

  })

  test("call next and attach the user when valid token belongs to a found user", async () => {
    const user = { username: "testuser", email: "test@example.com" };
    const select = vi.fn().mockResolvedValue(user);
    const findById = vi.spyOn(User, "findById").mockReturnValue({ select });
    const token = jwt.sign({ id: "user123" }, process.env.JWT_SECRET);
    const req = { cookies: { [COOKIE_NAME]: token } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    await authenticate(req, res, next);

    expect(findById).toHaveBeenCalledWith("user123");
    expect(select).toHaveBeenCalledWith("username email");
    expect(req.user).toBe(user);
    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
