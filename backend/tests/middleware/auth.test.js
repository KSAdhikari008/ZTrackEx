import { describe, test, expect, vi } from "vitest";
import { COOKIE_NAME } from "../../src/config/cookie.js";
import jwt from "jsonwebtoken";

// Set the test secret before importing the middleware so it uses the test secret instead of the production secret.
process.env.JWT_SECRET = 'text-jwt-secret'
import { authenticate } from "../../src/middleware/auth.js";


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
    // NOTE how [] returns here.
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
});
