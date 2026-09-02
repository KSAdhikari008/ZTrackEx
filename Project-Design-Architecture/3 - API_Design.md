# API designs

List your endpoints on paper first:

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/expenses          (with query params: ?category=&from=&to=)
POST   /api/expenses
PUT    /api/expenses/:id
DELETE /api/expenses/:id
GET    /api/expenses/summary  (aggregated totals)
```

Decide your response shape and error format upfront, and keep it consistent everywhere, e.g.:
```json
{ "success": true, "data": {...} }
{ "success": false, "message": "..." }
```

## Auth - /api/auth

POST   /register
POST   /login

## Expense - /api/expenses

GET /?page=x&limit=10&.. - query based numbered pagination to be used on expnese list.Check example below.
GET /month               - expense so far this month
GET /:id                 - get single expense by id
POST /                   - add/create new expense (has category and update budget)
PATCH /:id               - edit/update expense by id
DELETE /:id              - delete by id


## Budget - /api/budgets

GET /                    - total monthly budget  
GET /category            - monthly budget of all categories.Also check that total of category budget shouldn't excced total monthly budget.
POST /                   - Create budget for a category
PATCH /:id               - Edit budget
DELETE /:id              - delete budget

## Dashboard - /api/dashboards

GET /api/dashboard?month=2026-09  - returns all the data required for the dashboard/home.

## Categories - /api/categories

GET /api/categories      - gives enum categories from constant.js file, more on 4 folder structore notes.

# NOTE:

## api/expenses
pagination api Example:-

    GET /api/expenses?page=1&limit=20&category=food&from=2026-08-01&to=2026-08-31&sort=date_desc

    res:
    {
        "data": [ ... ],
        "meta": {
            "page": 1,
            "limit": 20,
            "totalItems": 143,
            "totalPages": 8
            }
    }


## api/dashboard

queries and aggregations:

    -- total spent this month
    SELECT SUM(amount) FROM expenses WHERE user_id=? AND date BETWEEN start AND end;

    -- spending by category (also gives you top category)
    SELECT category, SUM(amount) as total FROM expenses
    WHERE user_id=? AND date BETWEEN start AND end
    GROUP BY category ORDER BY total DESC;

    -- budget left = SUM(budgets.amount) - total spent, from your budgets table

    -- recent expenses
    SELECT * FROM expenses WHERE user_id=? ORDER BY date DESC LIMIT 5;

res ex:
    {
        "totalSpentThisMonth": 2148.30,
        "budgetLeft": 651.70,
        "topCategory": {
            "name": "Food",
            "amount": 816.35,
            "percentage": 38
        },
        "spendingByCategory": [
            { "category": "Food", "amount": 816.35, "percentage": 38, "color": "#D85A30" },
            { "category": "Transport", "amount": 515.60, "percentage": 24, "color": "#378ADD" },
            { "category": "Bills", "amount": 429.66, "percentage": 20, "color": "#EF9F27" },
            { "category": "Other", "amount": 386.69, "percentage": 18, "color": "#5DCAA5" }
        ],
        "recentExpenses": [
            { "id": "e1", "merchant": "Whole Foods", "category": "Food", "amount": 54.20, "date": "2026-09-02T09:14:00Z" },
            { "id": "e2", "merchant": "Uber", "category": "Transport", "amount": 18.50, "date": "2026-09-01T18:40:00Z" }
        ]
    }


## ** for custom category in v2 , we will use separate api route giving specifc category budget.**