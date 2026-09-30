import express from "express";
import cors from "cors";
import { Expense } from "./models/expense.model.js";
import { User } from "./models/user.model.js";
import authRouter from "./routes/auth.routes.js";
import expensesRouter from "./routes/expenses.routes.js";
import budgetsRouter from "./routes/budgets.routes.js";
import dashboardsRouter from "./routes/dashboards.routes.js";
import categoriesRouter from "./routes/categories.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

//Routes
app.use("/auth",authRouter);
app.use("/expenses",expensesRouter);
app.use("/budgets",budgetsRouter);
app.use("/dashboards",dashboardsRouter);
app.use("/categories",categoriesRouter);


// app.post("/user", async(req,res)=>{

//   const {username, email, password} = req.body;

//   const user = await User.create({
//     username,
//     email,
//     password
//   })

//   res.json({
//     message: "User created successfully",
//     user
//   })
// })

// app.post("/expense", async (req, res) => {

//   const { title, amount, category, date, user } = req.body;

//   const exp = await Expense.create({
//     title,
//     amount,
//     category,
//     date,
//     user
//   });

//   res.json({
//     message: "Expense created successfully",
//     expense: exp
//   });
// });

export default app;