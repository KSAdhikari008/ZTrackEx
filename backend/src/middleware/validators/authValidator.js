import {body} from 'express-validator'

export const registerValidator = [

    body('username')
        .isString().withMessage('Invalid username').bail()
        .trim()
        .notEmpty().withMessage("Username is required.").bail()
        .isLength({max: 20, min: 3}).withMessage("Username must be 3 to 20 characters long.").bail()
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage("Username can only contain letters, numbers, and underscores."),

    body('email')
        .isString().withMessage('Invalid email').bail()
        .trim()
        .notEmpty().withMessage('Email is required').bail()
        .toLowerCase()
        .isLength({max: 254}).withMessage('Email is too long.').bail()
        .isEmail().withMessage('Invalid email format.'),
        
    body('password')
        .isString().withMessage('Invalid password').bail()
        .notEmpty().withMessage('Password is required.').bail()
        .isLength({min: 8, max: 64}).withMessage("Password must be 8 to 64 characters long.")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter.")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter.")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one number.")
        .matches(/[^A-Za-z0-9]/)
        .withMessage("Password must contain at least one special character.")
]

export const loginValidator = [
    body('identifier')
        .isString().withMessage("Invalid username or email.").bail()
        .trim()
        .notEmpty().withMessage("Username or email is required.").bail()
        .isLength({max: 254}).withMessage("Email or username is too long."),

    body('password')
        .notEmpty().withMessage("Password is required.").bail()
        .isString().withMessage('Invalid password.').bail()
        .isLength({ max: 128 }).withMessage('Password is too long.')

]