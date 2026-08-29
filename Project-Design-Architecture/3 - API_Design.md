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

## Expense - /api/expense

GET /                    - all expenses , shown on expense list page with pagination or infinit scroll.
GET /month               - expense so far this month
GET /:id                 - get single expense by id
POST /                   - add/create new expense (has category and update budget)
PATCH /:id               - edit/update expense by id
DELETE /:id              - delete by id


## Budget - /api/budget

GET /                    - monthlly budget
GET /:id                 - budget by category id
POST /                   - Create budget for a category
PATCH /:id               - Edit budget
DELETE /:id              - delete budget


