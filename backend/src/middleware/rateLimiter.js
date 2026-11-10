import { rateLimit } from "express-rate-limit";

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5,                 // Maximum 5 requests
    message: {
        message: "Too many login attempts. Try again later."
    },
    standardHeaders: "draft-8",
    legacyHeaders: false
});

export const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: {
        message: "Too many registration attempts. Try again later."
    },
    standardHeaders: "draft-8",
    legacyHeaders: false
});

export const deleteUserLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 3,
    message: {
        message: "Too many account deletion attempts. Try again later."
    },
    standardHeaders: "draft-8",
    legacyHeaders: false
});

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: {
        message: "Too many requests. Please try again later."
    },
    standardHeaders: "draft-8",
    legacyHeaders: false
});