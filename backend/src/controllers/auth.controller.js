import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt';
import { matchedData } from "express-validator";
import jwt from 'jsonwebtoken'
import { JWT_EXPIRES_IN, SALT_ROUNDS } from "../config/jwt.js";
import { authCookieOptions, baseCookieOptions, COOKIE_NAME,  } from "../config/cookie.js";

// Hash of a random string, generated once at startup. Used in Login controller.
// Used to keep res timing consistent for when the user doesn't exist or when the pswd doesn't match.
const DUMMY_HASH = bcrypt.hashSync('dummy-password-for-timing', SALT_ROUNDS)

async function registerUser(req,res,next){
    
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

        const hash = await bcrypt.hash(password,SALT_ROUNDS);


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

        res.cookie(COOKIE_NAME, token, authCookieOptions)
       
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
        const forwardedError = new Error('Something went wrong.')
        forwardedError.statusCode = 500
        return next(forwardedError)
    }

}

async function loginUser(req,res,next){

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

        res.cookie(COOKIE_NAME, token, authCookieOptions)

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
        const forwardedError = new Error('Something went wrong.')
        forwardedError.statusCode = 500
        return next(forwardedError)
    }
}

async function logoutUser(req,res,next){
    try{
    
        res.clearCookie(COOKIE_NAME,baseCookieOptions);

        return res.status(200).json({
            message: "Logged Out successfully."
        })
    }catch(err){
        console.log("Logout error: ",err)
        const forwardedError = new Error('Something went wrong.')
        forwardedError.statusCode = 500
        return next(forwardedError)
    }
}

async function getLoggedInUser(req,res){
   
    return res.status(200).json({
        message: "User is logged in.",
        user:{
            id: req.user.id,
            username: req.user.username,
            email: req.user.email
        }
    })
}

export {registerUser, loginUser, logoutUser, getLoggedInUser};