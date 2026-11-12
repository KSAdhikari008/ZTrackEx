import express from "express";
import { authenticate } from "../middleware/auth.js";
import { getAllExpenses, getMonthlyExpenses, getMonthlyTotal, getExpenseById, addExpense, updateExpense, deleteExpense } from "../controllers/expenses.controller.js";
import { addExpenseValidator, deleteExpenseValidator, getAllExpensesQueryValidator, getExpenseByIdValidator, getMonthlyExpensesQueryValidator, updateExpenseValidator } from "../middleware/validators/expense.validator.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/", authenticate, getAllExpensesQueryValidator, validate, getAllExpenses);
router.get("/month", authenticate, getMonthlyExpensesQueryValidator, validate, getMonthlyExpenses);
router.get("/monthlyTotal", authenticate, getMonthlyTotal);
router.get("/:id", authenticate, getExpenseByIdValidator, validate, getExpenseById);
router.post("/", authenticate, addExpenseValidator, validate, addExpense);
router.patch("/:id", authenticate, updateExpenseValidator, validate, updateExpense);
router.delete("/:id", authenticate, deleteExpenseValidator, validate, deleteExpense);

export default router;
