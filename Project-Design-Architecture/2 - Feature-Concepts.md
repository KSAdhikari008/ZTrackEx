# Full feature list and concepts to know for MVP

## MVP feature 

- Auth (JWT-based) only user.
- Add/edit/delete expenses.
- Categorize expenses (fixed category enum, not user-defined)
- Filter by date range and category 
- Dashboard with **one or two** charts (total by category — pie chart; spend over time — line/bar chart)
- Basic budget per category with a visual warning when exceeded (e.g., red progress bar)
- Pagination on the expense list

Why these feature for MVP:
- Auth + CRUD alone is "too easy".
- Adding **aggregation** (totals, charts) forces  to learn MongoDB's `$group`/`$match`, which is a genuinely useful and non-trivial skill.
- Budgets add a small bit of business logic (compare actual vs limit) without needing real-time infra.
- Skip multi-currency, receipt OCR, bank sync, group splitting — those add complexity that's mostly about integrating external services, not about learning MERN fundamentals.

## Concepts

## MongoDB / Mongoose concepts

### Covered:
- **Schema design**: defining fields, types, required/default values
- **Relationships**: referencing (`ObjectId` + `ref`) — e.g., Expense referencing User — and when to use `.populate()`
- **CRUD operations**: `find`, `findById`, `findOneAndUpdate`, `findByIdAndDelete`, `create`

### Yet to cover:
- **Query operators**: `$gte`, `$lte`, `$in` for filtering by date range/category
- **Aggregation pipeline**: `$match`, `$group`, `$sum`, `$sort` — this is what powers your "total by category" and "spend over time" charts. This is the single most important new concept for this project.
- **Indexes**: understanding why you'd index `userId` + `date` for performance
- **Validation**: schema-level validation (`required`, `min`, `enum`) vs manual validation



## Express concepts 

### Covered:
- **Routing**: organizing routes by resource (`/api/expenses`, `/api/auth`)
- **Middleware**: what it is and how it chains (`req, res, next`) — you'll write auth middleware, error-handling middleware, and maybe logging middleware
- **Controllers**: separating route definitions from logic (keeps routes.js thin)
- **Request handling**: reading `req.body`, `req.params`, `req.query` (query params matter a lot here — filters go through `req.query`)
- **Error handling**: centralized error-handling middleware instead of try/catch everywhere with duplicated logic
- **Status codes**: using them correctly (400 vs 401 vs 404 vs 500) — good habit, often skipped by beginners
- **CORS**: since your frontend and backend run on different ports in dev



## Authentication concepts

### Covered:
- **Password hashing**: bcrypt — never store plain text passwords
- **JWT basics**: what's in a token (header, payload, signature), how signing/verifying works
- **Where to store the token**: httpOnly cookie vs localStorage, and the security tradeoff (XSS risk with localStorage)
- **Protected routes**: middleware that checks the token before letting a request through
- **Authorization vs authentication**: authentication = who are you; authorization = are you allowed to touch *this* expense (i.e., checking `expense.userId === req.user.id` before allowing edit/delete)

### Yet to Cover:
- **Token expiry and refresh**: at minimum, understand what happens when a token expires (even if you don't implement refresh tokens for v1)


## React concepts

### Covered:
- **Component structure**: breaking UI into reusable pieces (ExpenseList, ExpenseForm, ExpenseCard, Dashboard)
- **State**: `useState` for local UI state, `useEffect` for data fetching on mount/update
- **Forms**: controlled components, form validation before submit
- **Routing**: React Router — public routes (login/register) vs protected routes (dashboard)
- **Global state**: Context API for auth state (is user logged in, who are they) — shared across the app without prop-drilling
- **API calls**: a centralized axios instance (with base URL and interceptor to attach the JWT to every request)
- **Conditional rendering**: showing loading states, empty states ("no expenses yet"), error states
- **Lists and keys**: rendering the expense list properly with unique keys


## Charts (new, small addition)

- A library like **Recharts** or **Chart.js** — you just need to know how to shape your API response into the `[{ category: "Food", total: 1200 }, ...]` format the chart library expects. The backend aggregation is the hard part; the chart library itself is mostly plug-and-play once your data's shaped right.

## General/glue concepts

- **Environment variables**: `.env` for Mongo URI, JWT secret, separating dev/prod config
- **RESTful API design**: consistent naming, consistent response shape
- **Client-server data flow**: understanding the full round trip (form submit → axios call → Express route → controller → Mongoose → MongoDB → response → React state update → re-render) — genuinely useful to trace through once end-to-end before building fast

---
