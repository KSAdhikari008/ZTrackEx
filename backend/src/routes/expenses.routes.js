import express from "express";
import { authenticate } from "../middleware/auth.js";
import { getAllExpenses, getMonthlyExpense, getExpenseById, addExpense, updateExpense, deleteExpense } from "../controllers/expenses.controller.js";
import { addExpenseValidator, getAllExpensesQueryValidator, getExpenseByIdValidator } from "../middleware/validators/expense.validator.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/", authenticate, getAllExpensesQueryValidator, validate, getAllExpenses);
router.get("/month", authenticate, getMonthlyExpense);
router.get("/:id", authenticate, getExpenseByIdValidator, validate, getExpenseById);
router.post("/", authenticate, addExpenseValidator, validate, addExpense);
router.patch("/:id", authenticate, updateExpense);
router.delete("/:id", authenticate, deleteExpense);

export default router;
