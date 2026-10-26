import { describe, test, expect } from "vitest";
import { validationResult } from "express-validator";
import { addExpenseValidator, getAllExpensesQueryValidator } from "../../../src/middleware/validators/expense.validator.js";
 

describe("getAllExpensesQueryValidator", ()=>{
    
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

    test("rejects when page is less than 1", async () => {
        const {errors} = await validateQuery({page: "0"})
        
        expect(errors).toHaveLength(1);
        expect(errors[0].path).toBe("page");
    });

    test("rejects when limit greater than 100", async () => {
        
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
        expect(errors[0].path).toBe("date");
    })

    test("accepts missing optional parameters", async () => {
        const { errors } = await validateQuery({});
        expect(errors).toHaveLength(0);
    });
});

describe("addExpenseValidator", ()=>{

    async function validateBody(body){
        const req = { body };
        
        for(const validator of addExpenseValidator){
            await validator.run(req)
        }

        return {
            req,
            errors: validationResult(req).array()
        }
    }

    // Test title
    test.for([
        {
            title: " expense 1 ",
            description: "accepts a valid title with leading/trailing whitespace"
        },
        {
            title: "a".repeat(30),
            description: "accepts a title of exactly 30 characters"
        }   
    ])("accepts $description", async ({title})=>{
        const {req, errors} = await validateBody({
            title,
            amount: "10",
            date: "2026-10-14",
            category: "Food"
        })

        expect(errors).toHaveLength(0)
        expect(req.body.title).toBe(title.trim())
    });

    test.for([
        {
            description: "a missing title"
        },
        {
            title: "",
            description: "an empty title"
        },
        {
            title: "   ",
            description: "a whitespace-only title"
        },
        {
            title: 123,
            description: "a non-string title"
        },
        
        {
            title: "a".repeat(31),
            description: "a title longer than 30 characters"
        }
    ])("rejects $description", async ({title})=>{
        const {errors} = await validateBody({
            title,
            amount: "10",
            date: "2026-10-14",
            category: "Food"
        }) 

        expect(errors).toHaveLength(1);
        expect(errors[0].path).toBe("title");

    })

    // Test amount
    test("accepts valid amount and rounds it to two decimal places",async ()=>{
        const amount = "120.345"; 
        const {req, errors} = await validateBody({
            title: "expense 1",
            amount
        })

        expect(errors).toHaveLength(0)
        expect(req.body.amount).toBe(Math.round(Number(amount)*100)/100)
        expect(typeof req.body.amount).toBe("number")
    })

    test.for([
        {
            description: "a missing amount"
        },
        {
            amount: "",
            description: "an empty amount"
            
        },
        {
            amount: "0",
            description: "a zero amount"
        },
        {
            amount: "-10",
            description: "a negative amount"
        },
        {
            amount: "not-a-number",
            description: "a non-numeric amount"
        }
    ])("rejects $description", async ({amount})=>{
        const {errors} = await validateBody({
            title: "expense 1",
            amount
        });

        expect(errors).toHaveLength(1)
        expect(errors[0].path).toBe("amount")
    })

    // Test date
    test("accepts a valid date and converts it to a Date object", async () => {
        const { req, errors } = await validateBody({
            title: "expense 1",
            amount: "10",
            date: "2026-10-14",
            category: "Food"
        });

        expect(errors).toHaveLength(0);
        expect(req.body.date).toBeInstanceOf(Date);
    });

    test("accepts a missing optional date", async () => {
        const { errors } = await validateBody({
            title: "expense 1",
            amount: "10",
            category: "Food"
        });

        expect(errors).toHaveLength(0);
    });

    test.for([
        {
            date: "not-a-date",
            description: "an invalid date"
        },
        {
            date: "14-10-2026",
            description: "a date in the wrong format, fails .ISO8601()"
        },
        {
            date: "2026-10-14T12:00:00Z",
            description: "a date with time component. fails format regex check"
        }
    ])("rejects $description", async ({ date }) => {
        const { errors } = await validateBody({
            title: "expense 1",
            amount: "10",
            date,
            category: "Food"
        });

        expect(errors).toHaveLength(1);
        expect(errors[0].path).toBe("date");
    });

    // Test category
    test("accepts a valid category and trims leading and trailing whitespace", async () => {
        const { req, errors } = await validateBody({
            title: "expense 1",
            amount: "10",
            category: "  Food  "
        });

        expect(errors).toHaveLength(0);
        expect(req.body.category).toBe("Food");
    });

    test("accepts a missing optional category", async () => {
        const { errors } = await validateBody({
            title: "expense 1",
            amount: "10"
        });

        expect(errors).toHaveLength(0);
    });

    test("rejects a non-string category", async () => {
        const { errors } = await validateBody({
            title: "expense 1",
            amount: "10",
            category: 123
        });

        expect(errors).toHaveLength(1);
        expect(errors[0].path).toBe("category");
    });

    test.for([
        {
            category: "",
            description: "an empty category"
        },
        {
            category: "Invalid",
            description: "an unknown category"
        }
    ])("rejects $description", async ({ category }) => {
        const { errors } = await validateBody({
            title: "expense 1",
            amount: "10",
            category
        });

        expect(errors).toHaveLength(1);
        expect(errors[0].path).toBe("category");
    });

})