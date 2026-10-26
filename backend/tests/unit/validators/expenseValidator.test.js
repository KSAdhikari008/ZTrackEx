import { describe, test, expect } from "vitest";
import { validationResult } from "express-validator";
import { getAllExpensesQueryValidator } from "../../../src/middleware/validators/expense.validator.js";

async function validateQuery(query) {
    const req = { query };

    for(const validator of getAllExpensesQueryValidator){
        await validator.run(req);
    }

    return {
        req,
        errors: validationResult(req).array(),
    };
}

describe("getAllExpensesQueryValidator", ()=>{
    
    test("accepts valid query parameters and sanitizes them", async ()=>{
        const { req, errors } = await validateQuery({
            page: "2",
            limit: "10",
            date: "2026-10-14",
        });

        expect(errors).toHaveLength(0);
        expect(req.query.page).toBe(2);
        expect(req.query.limit).toBe(10);
        expect(req.query.date).toBeInstanceOf(Date);
    });

    test("rejects page is less than 1", async () => {
        const {errors} = await validateQuery({page: "0"})
        
        expect(errors).toHaveLength(1);
        expect(errors[0].path).toBe("page");
    });

    test("rejects limit greater than 100", async () => {
        
        const { errors } = await validateQuery({ limit: "101" });
        
        expect(errors).toHaveLength(1);
        expect(errors[0].path).toBe("limit");
    });

    test.for([
        {
            date: "not-a-date",
            description: "an invalid date"
        },
        {
            date: "14-10-2026",
            description: "a date in the wrong format"
        }
    ])("rejects $description", async ({date})=>{
        const {errors} = await validateQuery({date});
        expect(errors).toHaveLength(1);
        expect(errors.some(er => er.path === "date")).toBe(true)
    })

    test("accepts missing optional parameters", async () => {
        const { errors } = await validateQuery({});
        expect(errors).toHaveLength(0);
    });
});