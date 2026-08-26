# PLANNING PHASE

## 1. Nail down the scope first

Write a one-paragraph description of what the app does, then list features in two buckets:

**Core (MVP)**
- User signup/login (auth)
- Add/edit/delete expenses
- Categorize expenses (food, rent, travel, etc.)
- View expenses in a list, filterable by date/category
- Basic dashboard (total spent, spent by category)

**Nice-to-have (v2)**
- rename username and password. make separate routes.
- custome catogary feature by using separate category schema.
- Budget per specific month (one document per user+category+month),Food, ₹5000, January 2025.Real history, can look back and see "what was my Food budget in March" accurately.
- Budgets per category with alerts
- Recurring expenses
- Charts/analytics
- Export to CSV/PDF
- Multi-currency support
- Shared/group expenses
- Oauth

Beginners often try to build v2 features on day one. Resist that — get MVP working end-to-end first, then layer on.

## 2. Design your data model before touching code

This is the step people skip and regret. On paper (or a tool like [dbdiagram.io](https://dbdiagram.io)), sketch your MongoDB collections:

**User**
- name, email, password (hashed), createdAt

**Expense**
- userId (ref to User)
- amount, category, description, date, paymentMethod, createdAt

**Category** (optional — could be a fixed enum instead, or a separate collection if you want users to create custom categories)

Ask yourself:
- Does a Category need to be its own collection, or is a string enum enough for MVP? (Start with enum, refactor later if needed.)
- Will you need aggregation queries (sum by category, sum by month)? If so, plan your schema to make those `$group` queries in MongoDB straightforward.
- What indexes will you need? (e.g., index on `userId` + `date` since you'll query "this user's expenses this month" constantly.)

## 3. Design your API before writing routes

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

## 4. Plan the folder structure

A clean separation saves pain later. A common MERN layout:

```
/server
  /config       (db connection, env setup)
  /constants    (categories.js for enum of categories)
  /models       (Mongoose schemas)
  /routes       (route definitions)
  /controllers  (business logic)
  /middleware   (auth, error handling)
  /utils
  server.js

/client
  /src
    /components
    /pages
    /context or /store  (state management)
    /services   (API calls, e.g. axios instance)
    /hooks
```

Deciding this now stops the "where does this file even go" problem three weeks in.

## 5. Decide your tech choices before you start

A few decisions worth making deliberately rather than defaulting into:

- **State management**: Context API is enough for a project this size; you probably don't need Redux.
- **Styling**: Tailwind, plain CSS, or a component library (MUI/shadcn) — pick one so you're not mixing approaches.
- **Auth strategy**: JWT stored in httpOnly cookie (more secure) vs localStorage (simpler but XSS-vulnerable). Worth understanding the tradeoff.
- **Validation**: Decide if you'll validate on frontend only, backend only, or both (should be both — never trust client input).

## 6. Set up environment and config properly, early

- `.env` file for secrets (Mongo URI, JWT secret) — and `.gitignore` it immediately, before your first commit.
- Separate configs for development vs production if you plan to deploy.
- Set up nodemon for the backend and a basic error-handling middleware from day one, not bolted on later.

## 7. Think about error handling and edge cases upfront

Not in detail, but at least ask:
- What happens if the user submits a negative amount?
- What if they delete an expense that doesn't exist?
- What if the token expires mid-session?

You don't need to solve these now, but knowing they exist shapes how you write the code the first time.

## 8. Version control habits

- Init git before writing code, not after.
- Commit early and often with meaningful messages.
- Consider a simple branch strategy even solo (e.g., `main` + feature branches) — good habit for team projects later.

## 9. Build order (once planning is done)

A sensible order to actually build in:
1. Backend: DB connection + User model + auth routes (register/login) — test with Postman/Thunder Client before any frontend exists
2. Backend: Expense model + CRUD routes — test these too
3. Frontend: Auth pages, wire up to backend
4. Frontend: Expense list + add/edit/delete, wire up to backend
5. Dashboard/summary view last, once raw data flows are solid

Building and testing the backend fully via Postman before touching React is a huge time-saver — it isolates bugs instead of debugging frontend and backend simultaneously.

---

Want me to help you sketch the actual Mongoose schemas and API route list next, or would you rather start with the folder scaffolding?