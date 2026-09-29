import mongoose from "mongoose";
import { category } from "../constants/category.js";


const budgetSchema = new mongoose.Schema({
    limit: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        enum: category,
        default: null // null applies to monthly budget, otherwise it will be a category-specific budget.
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

// Prevent a user from creating two budgets for the same category
budgetSchema.index({user: 1, category: 1},{unique: true});

export const Budget = mongoose.model("Budget", budgetSchema);