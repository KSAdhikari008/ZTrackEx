import express from "express";
import { registerUser, loginUser, logoutUser, getLoggedInUser } from "../controllers/auth.controller.js";
import { registerValidator } from "../middleware/validators/authValidator.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post('/register', registerValidator, validate , registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', getLoggedInUser);

export default router;
