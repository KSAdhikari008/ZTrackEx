import express from "express";
import { registerUser, loginUser, logoutUser, getLoggedInUser } from "../controllers/auth.controller.js";
import { loginValidator, registerValidator } from "../middleware/validators/authValidator.js";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.js";
import { loginLimiter, registerLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post('/register', registerLimiter, registerValidator, validate , registerUser);
router.post('/login', loginLimiter, loginValidator, validate, loginUser);
router.post('/logout', logoutUser);
router.get('/me', authenticate, getLoggedInUser);

export default router;
