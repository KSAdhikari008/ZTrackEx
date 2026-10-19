import jwt from 'jsonwebtoken'
import { COOKIE_NAME } from "../config/cookie.js";
import { User } from '../models/user.model.js';

export async function authenticate(req,res,next){

    try{

        const token = req.cookies?.[COOKIE_NAME];

        if(!token){
            return res.status(401).json({ message: 'User is not logged in.' })
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id).select('username email')
        
        if(!user){
            return res.status(401).json({message: "User is not logged in."})
        }
        
        req.user = user
        next()
        
    }catch(err){
        // res when jwt.verify throws
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Session expired or invalid.' })
        }

        console.error('Auth error:', err)
        return res.status(500).json({ message: 'Something went wrong.' })
    }
}