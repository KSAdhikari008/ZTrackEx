import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import expensesRouter from "./routes/expenses.routes.js";
import budgetsRouter from "./routes/budgets.routes.js";
import dashboardsRouter from "./routes/dashboards.routes.js";
import categoriesRouter from "./routes/categories.routes.js";
import usersRouter from "./routes/users.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { globalLimiter } from "./middleware/rateLimiter.js";

const app = express();
// Trust the three proxy hops in Render's infrastructure(render -> cloudflare -> clientIP) to identify the original client IP.
app.set("trust proxy", 3); 

//Middlewares
app.use(cors({
    origin:process.env.NODE_ENV === "development"
            ? process.env.ORIGIN_URL
            : process.env.ORIGIN_URL_PROD,
    credentials: true,
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(globalLimiter);

//Routes
app.use("/api/auth", authRouter);
app.use("/api/expenses", expensesRouter);
app.use("/api/budgets", budgetsRouter);
app.use("/api/dashboards", dashboardsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/users", usersRouter);

// 404 handler for undefined routes
app.use((req, res, next)=>{
  const forwardedError = new Error(`Can't find ${req.originalUrl} on this server!`);
  forwardedError.statusCode = 404;
  next(forwardedError);
})

app.use(errorHandler);

export default app;
