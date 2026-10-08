import { body } from "express-validator";

export const deleteValidator = [
    body('password')
        .notEmpty().withMessage('Password is required').bail()
        .isString().withMessage('Invalid password').bail()
        .isLength({ max: 128 }).withMessage('Password is too long.')
]