import { matchedData } from "express-validator";
import bcrypt from 'bcrypt'
import { User } from "../models/user.model.js";
import { Expense } from "../models/expense.model.js";
import { Budget } from "../models/budget.model.js";
import { baseCookieOptions, COOKIE_NAME } from "../config/cookie.js";

async function updateUsername(req, res) {
    // res.status(501).json({ message: "Not implemented" });
}

async function updatePassword(req, res) {
    // res.status(501).json({ message: "Not implemented" });
}

async function deleteUser(req, res) {

    try{

        const {password} = matchedData(req);
        
        const user = await User.findById(req.user.id).select('password')

        const isMatch = await bcrypt.compare(password, user.password)
        
        if(!isMatch){
            return res.status(403).json({message: 'Incorrect password.'})
        }

        // delete the user's data first, then the user
        await Expense.deleteMany({ user: req.user.id });
        await Budget.deleteMany({user: req.user.id});
        await User.deleteOne({_id: req.user.id})

        res.clearCookie(COOKIE_NAME,baseCookieOptions)

        return res.status(200).json({ message: 'Account deleted successfully.' })

    }catch(err){
        console.error('Delete account error:', err)
        return res.status(500).json({ message: 'Something went wrong.' })
    }
}

export { updateUsername, updatePassword, deleteUser };
