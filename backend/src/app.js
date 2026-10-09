import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { Expense } from "./models/expense.model.js";
import { User } from "./models/user.model.js";
import authRouter from "./routes/auth.routes.js";
import expensesRouter from "./routes/expenses.routes.js";
import budgetsRouter from "./routes/budgets.routes.js";
import dashboardsRouter from "./routes/dashboards.routes.js";
import categoriesRouter from "./routes/categories.routes.js";
import usersRouter from "./routes/users.routes.js";


const app = express();

//Middlewares
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

//Routes
app.use("/api/auth",authRouter);
app.use("/api/expenses",expensesRouter);
app.use("/api/budgets",budgetsRouter);
app.use("/api/dashboards",dashboardsRouter);
app.use("/api/categories",categoriesRouter);
app.use("/api/users",usersRouter);

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