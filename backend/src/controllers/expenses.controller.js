import { matchedData } from "express-validator";
import { Expense } from "../models/expense.model.js";

export const getAllExpenses = async (req, res, next) => {
    try {
          
        const {id} = req.user;
        const {page = 1, limit = 10, date} = matchedData(req, { locations: ["query"] });
        const skip = (page - 1) * limit;
        
        const filter = {user: id};

        if(date){
            const start = date; // NOTE
            const end = new Date(date);
            end.setUTCDate(end.getUTCDate() + 1);
            filter.date = {
                $gte: start,
                $lt: end
            }
        }

        const expenses = await Expense.find(filter)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .select('title amount category date');
        
        // convert the mongo doc to plain object and convert amount to rupees
        const formattedExpenses = expenses.map(ex => {
            const expense = ex.toObject();
            return {...expense, amount: expense.amount/100};
        })

        const totalExpenses = await Expense.countDocuments(filter);

        res.status(200).json({
          message: "Expenses retrieved successfully",
          data: { totalExpenses, expenses: formattedExpenses },
        });

    } catch (err) {

        console.error("Get all expenses error:", err);
        next(err)
        
    }
}

export const getMonthlyExpense = async (req, res, next) => {}
export const getExpenseById = async (req, res, next) => {}

export const addExpense = async (req, res, next) => {
    
    try{
        const user = req.user.id;
        const {title, amount, date, category} = matchedData(req);

        //convert amount to paisa
        const paisaAmount = Math.round(amount * 100);

        const expense = await Expense.create({
            title,
            amount: paisaAmount,
            user,
            date,
            category
        })

        const rupeeAmount = expense.amount/100;

        res.status(201).json({
            message: 'Expense added successfully',
            expense: {
                title: expense.title,
                amount: rupeeAmount,
                date: expense.date,
                category: expense.category
            }
        })

    }catch(err){
        console.error("Add expense error:", err)
        next(err)
    }
}

export const updateExpense = async (req, res, next) => {}
export const deleteExpense = async (req, res, next) => {}

