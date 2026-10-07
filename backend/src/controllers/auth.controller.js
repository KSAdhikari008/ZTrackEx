import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt';
import { matchedData } from "express-validator";
import jwt from 'jsonwebtoken'
import { JWT_EXPIRES_IN, JWT_SALT } from "../config/jwt.js";
import { COOKIE_NAME, cookieOptions } from "../config/cookie.js";

// Hash of a random string, generated once at startup. Used in Login controller.
// Used to keep res timing consistent for when the user doesn't exist or when the pswd doesn't match.
const DUMMY_HASH = bcrypt.hashSync('dummy-password-for-timing', JWT_SALT)

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
                message: "Email or Username already in use. "
            })
        }

        const hash = await bcrypt.hash(password,JWT_SALT);


        const user = await User.create({
            username,
            email,
            password: hash
        })

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: JWT_EXPIRES_IN}
        );

        res.cookie(COOKIE_NAME, token, cookieOptions)
       
        return res.status(201).json({
            message: 'User created successfully.',
            user: { id: user._id, username: user.username, email: user.email }
        })

    }catch(err){

        // handle err thrown by .create() during race condition.
        if (err.code === 11000) {
            return res.status(409).json({
                message: "Email or username already in use."
            });
        }
        console.error('Register error:', err)
        return res.status(500).json({ message: 'Something went wrong.' })
    }

}

async function loginUser(req,res){

    try{
        const {identifier, password} = matchedData(req);

        const user  = await User.findOne({
            $or: [
                {email: identifier.toLowerCase()}, // emails in DB are in lowercase.
                {username: identifier}
            ]
        })

        // Run bcrypt, even if the user doesn't exist so there no diff in res time.
        const isPswdCorrect = await bcrypt.compare(password, user ? user.password : DUMMY_HASH) 


        if(!user || !isPswdCorrect){
            return res.status(401).json({ message: 'Invalid credentials.'})
        }

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: JWT_EXPIRES_IN}
        )

        res.cookie(COOKIE_NAME, token, cookieOptions)

        return res.status(200).json({
            message: "Logged in successfully.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })

    }catch(err){
        console.error('Login error:', err)
        return res.status(500).json({message: 'Something went wrong.'})
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