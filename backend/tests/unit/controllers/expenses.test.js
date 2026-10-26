import { describe, test, vi, expect, afterEach } from "vitest";
import { getAllExpenses } from "../../../src/controllers/expenses.controller.js";
import { Expense } from "../../../src/models/expense.model.js";
import { getAllExpensesQueryValidator } from "../../../src/middleware/validators/expense.validator.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getAllExpenses", () => {
  test("return all expenses when page and limit are given but date in not.", async () => {
    const req = {
      user: { id: "user123" },
      query: {
        page: 1,
        limit: 15,
      },
    };

    // run validator so that matchData revieves the req data.
    for (const validator of getAllExpensesQueryValidator) {
      await validator.run(req);
    }

    const filter = { user: req.user.id };
    const skipTest = (req.query.page - 1) * req.query.limit;

    const expenses = [
      {
        title: "Test Expense",
        amount: 1000,
        category: "Food",
        date: "2024-06-01",
        toObject() {
          // mocks the mongo coc toObject when converting expenses to rupees
          return {
            title: this.title,
            amount: this.amount,
            category: this.category,
            date: this.date,
          };
        },
      },
      {
        title: "Test Expense 2",
        amount: 2000,
        category: "Transport",
        date: "2024-06-02",
        toObject() {
          return {
            title: this.title,
            amount: this.amount,
            category: this.category,
            date: this.date,
          };
        },
      },
    ];

    const query = {
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue(expenses),
    };
    const find = vi.spyOn(Expense, "find").mockReturnValue(query);
    const countDocuments = vi.spyOn(Expense, "countDocuments").mockReturnValue(20);
    const totalExpenses = 20;
    
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    await getAllExpenses(req, res, next);

    expect(find).toHaveBeenCalledWith(filter);
    expect(query.sort).toHaveBeenCalledWith({ date: -1 });
    expect(query.skip).toHaveBeenCalledWith(skipTest);
    expect(query.limit).toHaveBeenCalledWith(req.query.limit);
    expect(query.select).toHaveBeenCalledWith("title amount category date");
    expect(countDocuments).toHaveBeenCalledWith(filter);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Expenses retrieved successfully",
      data: {
        totalExpenses,
        expenses: [
          {
            title: "Test Expense",
            amount: 10,
            category: "Food",
            date: "2024-06-01",
          },
          {
            title: "Test Expense 2",
            amount: 20,
            category: "Transport",
            date: "2024-06-02",
          },
        ],
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  test.todo("return all expenses when page, limit and date are given");
  test.todo(
    "return all expenses when page and limit are not given but date is given",
  );
});
