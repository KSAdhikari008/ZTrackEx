import {describe, test, expect} from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';



describe("Integration test",()=>{
    
    const endpoint = "/api/expenses/";
    const payload = {
        title: "exp 1",
        amount: 2000,
        category: "Food"
    }
    
    test("add expense", async ()=>{
        
        const res = await request(app).post(endpoint).send(payload);
    })
})