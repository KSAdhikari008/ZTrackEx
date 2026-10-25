import { describe, test, vi, expect } from "vitest";
import { getAllExpenses } from "../../../src/controllers/expenses.controller.js";
import { Expense } from "../../../src/models/expense.model.js";
import { ResultWithContextImpl } from "express-validator/lib/chain";


describe("Test getAllExpenses controller:", ()=>{

    test("return all expenses when page and limit are given but date in not.", async ()=>{
       
        const req = { 
            user: { id: "user123"},
            query: {
                page: 1, limit: 10
            }
        };

        const filter = { user: req.user.id };
        const skipTest = (req.query.page - 1) * req.query.limit;    
        const expenses = [
          {
            title: "Test Expense",
            amount: 1000,
            category: "Food",
            date: new Date("2024-06-01"),
          },
          {
            title: "Test Expense 2",
            amount: 2000,
            category: "Transport",
            date: new Date("2024-06-02")
          }
        ];
        
        const query = {
            sort : vi.fn().mockReturnThis(),
            skip : vi.fn().mockReturnThis(),
            limit : vi.fn().mockReturnThis(),
            select : vi.fn().mockReturnValue(expenses)
        }
        const find = vi.spyOn(Expense, "find").mockReturnValue(query);

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }
        const next = vi.fn();

        await getAllExpenses(req, res, next);

        expect(find).toHaveBeenCalledWith(filter);
        expect(query.sort).toHaveBeenCalledWith({date: -1})
        expect(query.skip).toHaveBeenCalledWith(skipTest)
        expect(query.limit).toHaveBeenCalledWith(req.query.limit)
        // expect(res.status).toHaveBeenCalledWith(200)


    })

})