import { User } from "../models/user.model.js";


async function registerUser(req,res){
    
    try{
        const {username, email, password} = req.body;

        //check if user already exists.
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

        //hash pswd


        // create user
        const user = await User.create({
            username,
            email,
            password
        })
        // send res
        res.json({
            message: "User created successfully",
            user
        })

    }catch(err){
        res.json({
            message: err.message
        })
    }

}

async function loginUser(req,res){

}

async function logoutUser(req,res){

}

async function getLoggedInUser(req,res){
    res.json({
        message: "haha"
    })
}

export {registerUser, loginUser, logoutUser, getLoggedInUser};