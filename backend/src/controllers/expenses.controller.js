import { matchedData } from "express-validator";
import { Expense } from "../models/expense.model.js";

export const getAllExpenses = async (req, res, next) => {
    try {
        // NOTE add filter by date faeture as well.
        
        const {id} = req.user;
        const {page = 1, limit = 10} = matchedData(req, { locations: ["query"] });
        const skip = (page - 1) * limit;

        const expenses = await Expense.find({ user: id })
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .select('title amount category date user createdAt');

        const totalExpenses = await Expense.countDocuments({user: id});

        res.status(200).json({
            message: 'Expenses retrieved successfully',
            totalExpenses,
            expenses
        })

    } catch (err) {

        console.error(err);
        next(err)
        
    }
}

export const getMonthlyExpense = async (req, res, next) => {}
export const getExpenseById = async (req, res, next) => {}

export const createExpense = async (req, res, next) => {
    // NOTE convert amount to paisa for safer calculations.
    
    try{
        const user = req.user.id;
        const {title, amount, date, category} = matchedData(req);

        const expense = await Expense.create({
            title,
            amount,
            user,
            date,
            category
        })

        res.status(201).json({
            message: 'Expense created successfully',
            expense: {
                title: expense.title,
                amount: expense.amount,
                date: expense.date,
                category: expense.category
            }
        })

    }catch(err){
        console.error("Create expense error:", err)
        next(err)
    }
}

export const updateExpense = async (req, res, next) => {}
export const deleteExpense = async (req, res, next) => {}

