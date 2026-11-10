import express from 'express'
import { updateUsername, updatePassword, deleteUser } from '../controllers/users.controller.js'
import { authenticate } from '../middleware/auth.js';
import { deleteValidator } from '../middleware/validators/usersValidator.js';
import { validate } from '../middleware/validate.js';
import { deleteUserLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.patch('/username', updateUsername);
router.patch('/password', updatePassword);
router.delete('/me', authenticate, deleteUserLimiter, deleteValidator, validate, deleteUser);

export default router;