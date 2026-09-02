# FOLDER STRUCTURE

## backend/
├── src/
│   ├── config/
│   │   └── db.js              # Postgres pool/connection setup
│   ├── constants/
│   │   └── categories.js      # fixed category enum: names, colors, icons
│   ├── controllers/
│   │   ├── expenseController.js
│   │   ├── budgetController.js
│   │   └── authController.js
│   ├── routes/
│   │   ├── expenseRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── authRoutes.js
│   ├── middleware/
│   │   ├── authenticate.js    # JWT/session check
│   │   └── errorHandler.js
│   ├── models/                # or "queries/" if raw SQL, not Prisma
│   │   ├── expenseQueries.js
│   │   └── budgetQueries.js
│   ├── utils/
│   │   └── validators.js
│   └── app.js                 # Express app setup (middleware, route mounting)
├── migrations/                 # If needed, raw SQL migration files (if not using Prisma)
│   ├── 001_create_users.sql
│   ├── 002_create_expenses.sql
│   └── 003_create_budgets.sql
├── .env                        # DB credentials, JWT secret, etc.
├── .env.example
├── package.json
└── server.js                   # entry point — starts the server, imports app.js


## frontend/
├── src/
│   ├── components/
│   │   ├── ui/                 # shadcn components live here (button, card, dialog...)
│   │   ├── ExpenseCard.jsx
│   │   ├── CategoryBar.jsx
│   │   └── AddExpenseForm.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Transactions.jsx
│   │   ├── Budgets.jsx
│   │   ├── Login.jsx
│   │   └── Settings.jsx
│   ├── layouts/
│   │   └── DashboardLayout.jsx # sidebar + top bar wrapper shared across pages
│   ├── hooks/
│   │   ├── useExpenses.js      # data-fetching hooks (e.g. wrapping React Query)
│   │   └── useMediaQuery.js
│   ├── services/
│   │   ├── api.js              # base axios/fetch instance (baseURL, interceptors, auth headers)
│   │   ├── expenseService.js
│   │   ├── budgetService.js
│   │   ├── dashboardService.js
│   │   └── authService.js
│   │   └── utils.js
│   ├── context/                # or store/ if using Zustand/Redux
│   │   └── AuthContext.jsx
│   ├── App.jsx                 # routes defined here (react-router)
│   ├── main.jsx                # React entry point
│   └── index.css               # Tailwind base + global styles
├── public/
├── .env                        # e.g. VITE_API_URL
├── tailwind.config.js
├── package.json
└── vite.config.js              # (assuming Vite, common for React apps now)

# NOTES:

## folder flow:

- routes/ → controllers/ → models/(queries) is the standard 3-layer split — keeps route files thin (just wiring), controllers handle logic/validation, and models own the actual SQL. This also makes the eventual Prisma migration cleaner later — you'd mostly just be swapping out what's inside models/, not restructuring the whole app.

- lib/api.js on the frontend — centralize your fetch calls here (getExpenses(), createExpense(), getDashboardSummary()) rather than scattering fetch() calls inside components. Makes it trivial to add auth headers, handle errors consistently, or swap base URLs between dev/prod.

- hooks/ — if you use React Query (recommended for this kind of app — handles caching, loading states, refetching automatically), wrap each API call in a custom hook like useExpenses(filters). Keeps components clean and avoids manual useEffect + useState boilerplate for every fetch.

- Whether you keep frontend/backend in one repo (monorepo) or two separate repos is up to you — for a solo MVP, one repo with two folders is simpler to manage.

## /services:
The services/ folder (sometimes called api/ instead) is where you put the actual functions that talk to your backend — one function per API call, organized by resource.

### Example:

// services/api.js
  import axios from 'axios';

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  export default api;

// services/expenseService.js
  import api from './api';

  export const getExpenses = (params) => api.get('/expenses', { params });
  export const getExpenseById = (id) => api.get(`/expenses/${id}`);
  export const createExpense = (data) => api.post('/expenses', data);
  export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);
  export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

// services/dashboardService.js
  import api from './api';

  export const getDashboardSummary = (month) =>
    api.get('/dashboard', { params: { month } });

### Benfits of havign this layer, instead of calling fetch/axios directly inside components:

Single source of truth per endpoint — if the /expenses URL or its params ever change, you fix it in one place, not in every component that happened to fetch expenses.
Components stay clean — they call getExpenses(filters) and don't care about HTTP verbs, headers, or base URLs.
Easy to swap or mock — for testing, or if you ever switch from REST to GraphQL, you only touch services/, not every component.
Pairs well with Hooks and react query.

## /hooks
/services pairs naturally with hooks — your hooks/useExpenses.js (React Query or plain useState/useEffect) calls into services/expenseService.js, not raw axios:

// hooks/useExpenses.js
  import { useQuery } from '@tanstack/react-query';
  import { getExpenses } from '../services/expenseService';

  export function useExpenses(filters) {
    return useQuery({
      queryKey: ['expenses', filters],
      queryFn: () => getExpenses(filters),
    });
  }

## /constants
** Since you're not using a monorepo-shared-constants setup necessarily. Instead of hardcoding the list on the frontend at all, expose a small endpoint:

GET /api/categories

...that just returns the array from your single backend constants file. Your React dropdown fetches this on mount instead of importing a local copy. Now there's truly only one source of truth (the backend file), and the frontend never has its own copy to go stale.

it's realistic practice for something you'll do constantly in real apps — the frontend asking the backend for reference/lookup data instead of hardcoding it. It also means if you ever move to the custom-user-categories v2 feature, this endpoint just evolves naturally into "return default + user's custom categories" instead of you having to rip out a hardcoded frontend array later. **

