# 7. Error handling and edge cases.

Basic error-handling middleware from day one, not bolted on later:

### Error-handling middleware

- A global "error handler" that takes four arguments instead of three (err, req, res, next)
- In a separate file, import into server.js, always as the last app.use() — after all the routes.
- Removes the repetitive res.status(...).json(...) boilerplate

js
// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error"
  });
};

js
// server.js
const errorHandler = require("./middleware/errorHandler");

app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);

// must come AFTER all routes
app.use(errorHandler);

#### Why this matters/without this 
If something throws an error in one of your controllers and you didn't wrap it in try/catch, your server can crash entirely, or Express sends a default ugly HTML error page instead of a clean JSON response your React frontend can actually parse and display.
I
nstead of writing res.status(500).json(...) every single try/catch block ,call next(err) and let the global handler deal with formatting the response:

### Example:

// controller 1: expense not found
const getExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      const error = new Error("Expense not found");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
};

// controller 2: user tries to edit someone else's expense
const updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (expense.user.toString() !== req.user.id) {
      const error = new Error("Not authorized to edit this expense");
      error.statusCode = 403;
      return next(error);
    }
    // ... update logic
  } catch (err) {
    next(err);
  }
};

- Add some logic to recognize known error types(not custom thrown) and customize the response accordingly.

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Server Error";

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Mongoose duplicate key (unique field violation)
  if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate value for ${Object.keys(err.keyValue)}`;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(", ");
  }

  res.status(statusCode).json({ success: false, message });
};



## Edge Cases

Not in detail, but at least ask:
- What happens if the user submits a negative amount?
- What if they delete an expense that doesn't exist?
- What if the token expires mid-session?
