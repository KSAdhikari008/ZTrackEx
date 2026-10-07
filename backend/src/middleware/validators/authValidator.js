import {body} from 'express-validator'

export const registerValidator = [

    body('username')
        .trim()
        .notEmpty()
        .withMessage("Username is required.").bail()
        .isLength({max: 20, min: 3})
        .withMessage("Username must be 3 to 20 characters long.")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage("Username can only contain letters, numbers, and underscores."),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required').bail()
        .toLowerCase()
        .isEmail()
        .withMessage('Invalid email format.'),
        
    body('password')
        .notEmpty()
        .withMessage('Password is required.').bail()
        .isLength({min: 7, max: 64})
        .withMessage("Password must be 7 to 64 characters long.")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter.")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter.")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one number.")
        .matches(/[^A-Za-z0-9]/)
        .withMessage("Password must contain at least one special character.")
]
