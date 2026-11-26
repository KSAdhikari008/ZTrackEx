import { describe, test, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("User routes", () => {
  test("account deletion requests are rate limited before authentication", async () => {
    for (let attempt = 0; attempt < 3; attempt++) {
      const response = await request(app).delete("/api/users/me");
      expect(response.status).toBe(401);
    }

    const response = await request(app).delete("/api/users/me");
    expect(response.status).toBe(429);
  });
});
