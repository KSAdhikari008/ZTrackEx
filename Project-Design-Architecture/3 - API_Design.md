# API designs

## Auth - /api/auth

POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me         - A protected route that returns the logged-in user's own info, called on page load/refresh to check "is there a valid session right now?"

## Users - /api/users

PATCH /api/users/username
PATCH /api/users/password
DELETE /api/users/me

Update username / Update password — PATCH /api/users/username, PATCH /api/users/password
We already designed these earlier — technically these live more naturally under a /users route group than /auth, but they're auth-adjacent since password changes involve the same hashing concerns.

Delete account — DELETE /api/users/me
Lets a user delete their own account (and probably cascade-delete their Expenses/Budgets too, or you'd have orphaned data referencing a deleted user). Not strictly necessary for MVP, but a very common expectation in any real app with auth.

## Expense API — `/api/expenses`

The Expense API handles expense creation, retrieval, updates, deletion, pagination, and date-based filtering. All expense operations are scoped to the authenticated user.

### 1. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Retrieve paginated expenses |
| GET | `/month` | Retrieve current month's expenses |
| GET | `/:id` | Retrieve a single expense |
| POST | `/` | Create an expense |
| PATCH | `/:id` | Partially update an expense |
| DELETE | `/:id` | Delete an expense |

### 2. Expense List & Pagination

**Example request:**

`GET /api/expenses?page=1&limit=20&date=2026-08-01`

The expense list API supports numbered pagination and optional filtering by a specific date.

- `page`: Page number (default: `1`).
- `limit`: Results per page (default: `10`, maximum: `100`).
- `date`: Optional date filter (`YYYY-MM-DD`).
- Expenses are sorted by date descending, followed by ID descending.
- Category filtering, date ranges (`from` / `to`), and custom sorting are not currently supported.

**Example response:**

```json
{
  "message": "Expenses retrieved successfully",
  "data": {
    "totalExpenses": 143,
    "expenses": [
      {
        "_id": "...",
        "title": "...",
        "amount": 12.34,
        "category": "...",
        "date": "..."
      }
    ]
  }
}
```

### 3. Amount Handling

Expense amounts are stored as integers in **paisa** rather than rupees to avoid floating-point precision issues.

- Rupees to paisa: `Math.round(amount * 100)`
- Paisa to rupees: `amount / 100`

Amounts are converted back to rupees in API responses.

### 4. Date Handling & Filtering

The application uses JavaScript `Date` objects for storing and querying expense dates.

**User-provided dates:**
- The frontend sends date-only strings through FormData, such as `"2026-10-24"`.
- The expense validator converts them into JavaScript Date objects.
- Date-only ISO strings are interpreted as midnight UTC (`2026-10-24T00:00:00.000Z`).

**Default dates:**
- The Expense schema uses `Date.now` as its default.
- This stores the current timestamp rather than normalizing it to midnight UTC.

**Filtering by a specific day:**

Since expense timestamps may contain different times, date filtering uses an inclusive start and exclusive end boundary.

```js
date: {
    $gte: new Date("2026-10-24T00:00:00.000Z"),
    $lt: new Date("2026-10-25T00:00:00.000Z")
}
```

- `$gte`: Includes the beginning of the selected day.
- `$lt`: Excludes the beginning of the following day.

This ensures all expenses within the selected UTC calendar day are retrieved.

### 5. Monthly Expense Calculation

The monthly expense endpoint uses the first day of the current month and the first day of the next month as its date boundaries.

```js
const now = new Date();

const startOfMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
);

const startOfNextMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)
);
```

**MongoDB query:**

```js
Expense.find({
    user: userId,
    date: {
        $gte: startOfMonth,
        $lt: startOfNextMonth
    }
});
```

Using the first day of the next month as the exclusive upper boundary automatically handles different month lengths, leap years, and year transitions.

### 6. Date Utility Libraries

Native JavaScript Date methods are currently used for date calculations. For more complex date manipulation or timezone handling, libraries such as `date-fns` or `dayjs` can be introduced if needed.


## Budget - /api/budgets

GET /                    - total monthly budget  
GET /category            - monthly budget of all categories.Also check that total of category budget shouldn't excced total monthly budget.
POST /                   - Create budget for a category
PATCH /:id               - Edit budget
DELETE /:id              - delete budget

## Dashboard - /api/dashboards

GET /api/dashboard?month=2026-09  - returns all the data required for the dashboard/home.

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


## Categories - /api/categories

GET /api/categories      - gives enum categories from constant.js file, more on 4 folder structore notes.

# OTHERS:

## Response Shape
```json
{ "message": "", "data": {...} }
{ "message": "", "errors": [] }
```

## ** for custom category in v2 , we will use separate api route giving specifc category budget.**