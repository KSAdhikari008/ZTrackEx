import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt';
import { matchedData } from "express-validator";
import jwt from 'jsonwebtoken'

async function registerUser(req,res){
    
    try{

        const {username, email, password} = matchedData(req);

        const alreadyRegistered = await User.findOne({
            $or: [
                {email},
                {username}
            ]
        });

        if(alreadyRegistered){
            return res.status(409).json({
                message: "Already registered. Try logging in. "
            })
        }

        const hash = await bcrypt.hash(password,10);


        const user = await User.create({
            username,
            email,
            password: hash
        })

        const token = jwt.sign({
            id: user._id,
        },process.env.JWT_SECRET);


        res.cookie('TrackEx_token',token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 1000*60*60*24*7
        })

       
        return res.status(201).json({
            message: "User created successfully"
        })

    }catch(err){

        // handle err thrown by .create() during race condition.
        if (err.code === 11000) {
            return res.status(409).json({
                message: "Email or username already exists."
            });
        }

        return res.status(500).json({
            message: "Internal Server Error: " + err.message
        })
    }

}

async function loginUser(req,res){
    try{

    }catch(err){
        
    }
}

async function logoutUser(req,res){

}

async function getLoggedInUser(req,res){
    res.json({
        message: "haha"
    })
}

export {registerUser, loginUser, logoutUser, getLoggedInUser};