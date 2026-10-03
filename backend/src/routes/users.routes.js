import express from 'express'
import { updateUsername, updatePassword, deleteUser } from '../controllers/users.controller.js'

const router = express.Router();

router.patch('/username', updateUsername);
router.patch('/password', updatePassword);
router.delete('/me/:id', deleteUser);

export default router;