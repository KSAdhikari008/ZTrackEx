import express from "express";
import { registerUser, loginUser, logoutUser, getLoggedInUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', getLoggedInUser);

export default router;
