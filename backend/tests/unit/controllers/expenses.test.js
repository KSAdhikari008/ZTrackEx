import { describe, test, vi, expect, afterEach } from "vitest";
import { getAllExpenses } from "../../../src/controllers/expenses.controller.js";
import { Expense } from "../../../src/models/expense.model.js";
import { getAllExpensesQueryValidator } from "../../../src/middleware/validators/expense.validator.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getAllExpenses", () => {
  test("returns paginated expenses without a date filter", async () => {
    const req = {
      user: { id: "user123" },
      query: {
        page: 2,
        limit: 5,
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
    const countDocuments = vi.spyOn(Expense, "countDocuments").mockResolvedValue(20);
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

  test("returns paginated expenses filtered by date", async () => {
    
    const req = {
        user: { id: "user123"},
        query: {
            page: 1, 
            limit: 5,
            date: "2026-10-14"
        }
    };
    const skip = (req.query.page - 1)*req.query.limit;

    for(const validator of getAllExpensesQueryValidator){
        await validator.run(req)
    }

    const start = new Date(req.query.date);
    const end = new Date(req.query.date);
    end.setUTCDate(end.getUTCDate() + 1);

    const filter = {
        user: req.user.id,
        date: {
            $gte: start,
            $lt: end
        }
    }

    const expenses = [
      {
        title: "Test Expense",
        amount: 1000,
        category: "Food",
        date: "2026-10-14",
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
        date: "2026-10-14",
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
    }

    const find = vi.spyOn(Expense, 'find').mockReturnValue(query)
    const countDocuments = vi.spyOn(Expense, 'countDocuments').mockResolvedValue(20)
    const totalExpenses = 20; 

    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
    }
    const next = vi.fn();

    await getAllExpenses(req, res, next);

    expect(find).toHaveBeenCalledWith(filter);
    expect(query.sort).toHaveBeenCalledWith({date: -1})
    expect(query.skip).toHaveBeenCalledWith(skip)
    expect(query.limit).toHaveBeenCalledWith(req.query.limit)
    expect(query.select).toHaveBeenCalledWith('title amount category date')
    expect(countDocuments).toHaveBeenCalledWith(filter)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
        message: "Expenses retrieved successfully",
        data: {
            totalExpenses,
            expenses: [
                {
                    title: "Test Expense",
                    amount: 10,
                    category: "Food",
                    date: "2026-10-14"
                },
                {
                    title: "Test Expense 2",
                    amount: 20,
                    category: "Transport",
                    date: "2026-10-14"
                }
            ]
        }
    })
    expect(next).not.toHaveBeenCalled();
  });

  test("uses default pagination when filtering expenses only by date", async () => {
    const req = {
      user: { id: "user123" },
      query: {
        date: "2026-10-14",
      }
    };

    for(const validator of getAllExpensesQueryValidator){
      await validator.run(req);
    }

    const start = new Date("2026-10-14");
    const end = new Date("2026-10-15");
    const filter = {
      user: req.user.id,
      date: {
        $gte: start,
        $lt: end
      }
    };
    const expenses = [
      {
        title: "Test Expense",
        amount: 1000,
        category: "Food",
        date: start,
        toObject() {
          return {
            title: this.title,
            amount: this.amount,
            category: this.category,
            date: this.date
          };
        }
      }
    ];
    const query = {
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue(expenses)
    };
    const find = vi.spyOn(Expense, "find").mockReturnValue(query);
    const countDocuments = vi.spyOn(Expense, "countDocuments").mockResolvedValue(1);
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    const next = vi.fn();

    await getAllExpenses(req, res, next);

    expect(find).toHaveBeenCalledWith(filter);
    expect(query.sort).toHaveBeenCalledWith({ date: -1 });
    expect(query.skip).toHaveBeenCalledWith(0);
    expect(query.limit).toHaveBeenCalledWith(10);
    expect(query.select).toHaveBeenCalledWith("title amount category date");
    expect(countDocuments).toHaveBeenCalledWith(filter);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Expenses retrieved successfully",
      data: {
        totalExpenses: 1,
        expenses: [
          {
            title: "Test Expense",
            amount: 10,
            category: "Food",
            date: start
          }
        ]
      }
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("returns an empty array when no expenses match the filter", async () => {
    const req = {
      user: { id: "user123" },
      query: {
        page: 1,
        limit: 10,
      },
    };

    for (const validator of getAllExpensesQueryValidator) {
      await validator.run(req);
    }

    const filter = { user: req.user.id };
    const query = {
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue([]),
    };
    const find = vi.spyOn(Expense, "find").mockReturnValue(query);
    const countDocuments = vi.spyOn(Expense, "countDocuments").mockResolvedValue(0);
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    await getAllExpenses(req, res, next);

    expect(find).toHaveBeenCalledWith(filter);
    expect(countDocuments).toHaveBeenCalledWith(filter);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Expenses retrieved successfully",
      data: {
        totalExpenses: 0,
        expenses: [],
      },
    });
    expect(next).not.toHaveBeenCalled();
  });
  
  test("should pass count query errors to the error handler", async () => {
    const req = {
      user: { id: "user123" },
    };

    const error = new Error("Count query failed");
    const query = {
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue([]),
    };
    vi.spyOn(Expense, "find").mockReturnValue(query);
    const countDocuments = vi.spyOn(Expense, "countDocuments").mockRejectedValue(error);
    
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    await getAllExpenses(req, res, next);

    expect(countDocuments).toHaveBeenCalledWith({ user: req.user.id });
    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
