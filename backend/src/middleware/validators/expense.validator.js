import { body, query } from "express-validator";
import { category } from "../../constants/category.js";

export const getAllExpensesQueryValidator = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer').bail()
        .toInt(),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be an integer between 1 and 100').bail()
        .toInt()
];

export const createExpenseValidator = [
    body('title')
        .isString().withMessage('Invalid title').bail()
        .trim()
        .notEmpty().withMessage('Title is required').bail()
        .isLength({max: 30}).withMessage("Title can't be longer than 30 characters").bail(),

    body('amount')
        .notEmpty().withMessage('Amount is required').bail()
        .isFloat({ gt: 0 }).withMessage('Amount must be greater than 0').bail()
        .customSanitizer(value => Math.round(Number(value) * 100) / 100),

    body('date')
        .optional()
        .isISO8601().withMessage('Invalid date').bail()
        .toDate(),

    body('category')
        .optional()
        .isString().withMessage('Invalid category').bail()
        .trim()
        .isIn(category).withMessage('Invalid category')
]