import { validationResult } from "express-validator";


export function validate(req, res, next){

    const result = validationResult(req);

    
    if(!result.isEmpty()){

        // Keep only the field and msg proerties. Oher properties are sensitive (val, location etc.)
        const errors = result.array().map(err => ({
            field: err.path, 
            message: err.msg
        }))

        
        return res.status(400).json({
            message: "Validation failed.",
            errors
        })
    }

    next()
}