import mongoose from 'mongoose';
import { category } from '../constants/category.js';

const expenseSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        enum: category,
        default: "Others"
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

},{timestamps: true});

// Create an index on the user and date fields for efficient querying
expenseSchema.index({user: 1, date: -1});

export const Expense = mongoose.model('Expense', expenseSchema);