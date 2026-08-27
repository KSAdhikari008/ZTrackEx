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

GET /:userId