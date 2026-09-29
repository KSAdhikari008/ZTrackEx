import express from "express";
import cors from "cors";
import { Expense } from "./models/expense.model.js";
import { User } from "./models/user.model.js";

const app = express();

app.use(cors());
app.use(express.json());

//Routes

app.post("/user", async(req,res)=>{

  const {username, email, password} = req.body;

  const user = await User.create({
    username,
    email,
    password
  })

  res.json({
    message: "User created successfully",
    user
  })
})

app.post("/expense", async (req, res) => {

  const { title, amount, category, date, user } = req.body;

  const exp = await Expense.create({
    title,
    amount,
    category,
    date,
    user
  });

  res.json({
    message: "Expense created successfully",
    expense: exp
  });
});

export default app;