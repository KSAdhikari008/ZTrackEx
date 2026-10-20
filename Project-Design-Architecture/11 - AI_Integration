# TrackEx — AI Integration with Gemini API

## 1. Overview

Integrate Google's Gemini API into TrackEx to analyze spending patterns, answer questions about transactions, and provide personalized financial insights.

**Tech stack:** React + Node.js + Express + MongoDB + Gemini API

The Gemini API key must remain on the backend in an environment variable. Never expose it in frontend code.

## 2. Features to Build — Step-by-Step Guide

Follow this order to keep development manageable.

### Step 1: AI Spending Insights

Generate personalized insights from the user's monthly expenses.

Examples:
- Food spending increased by 20% compared with last month.
- Shopping is the largest spending category.
- Transportation expenses decreased this month.

**Implementation:** Fetch transactions → calculate statistics in JavaScript → send statistics to Gemini → display insights in React.

### Step 2: Monthly Financial Summary

Generate a monthly report containing:
- Total income and expenses
- Spending by category
- Changes compared with the previous month
- Notable spending patterns
- Suggestions for the next month

Reuse the statistics and Gemini integration from Step 1.

### Step 3: Ask Your Expenses (AI Chatbot)

Allow users to ask questions about their own financial data.

Examples:
- How much did I spend on food this month?
- Compare my spending this month with last month.
- What were my five largest expenses?
- Where could I reduce my spending?

Initially, support a few predefined question types. Then implement Gemini function calling to handle more flexible questions.

### Step 4: Smart Budget Recommendations

Use historical spending and existing budget information to suggest reasonable budgets and identify potential overspending.

The backend calculates averages and budget usage. Gemini explains the results and recommendations.

### Step 5: Natural-Language Expense Entry

Allow users to describe transactions in plain language.

Example: "Paid ₹250 for lunch today using UPI."

Gemini extracts structured fields such as amount, category, date, description, and payment method. Validate the output and ask the user to confirm before saving the transaction.

---

## 3. How the AI Chatbot Works

Example question:

"How much did I spend on food this month, and why is it higher than last month?"

1. **React:** Sends the user's question to an Express API endpoint.
2. **Authentication:** Express verifies the session and identifies the user.
3. **Database:** The backend retrieves that user's relevant transactions from MongoDB.
4. **Calculations:** JavaScript calculates current-month and previous-month totals.
5. **Gemini:** Receives the question and verified statistics, then generates an explanation.
6. **Response:** Express returns the answer to React for display.

Example response:

"You spent ₹4,200 on food this month, ₹700 more than last month. The increase came mainly from restaurant purchases."

The numbers above are illustrative. The application must use actual database results.

## 4. Two Approaches to Answering Questions

### Approach A: Backend-Calculated Data

The backend retrieves relevant transactions, calculates the statistics, and sends them to Gemini.

**Best for:** Spending insights and monthly reports.

This is the simplest approach and should be implemented first.

### Approach B: Gemini Function Calling

Define backend functions such as:

- `getMonthlySpending()`
- `getCategoryBreakdown()`
- `compareMonthlySpending()`
- `getLargestExpenses()`

Gemini selects an appropriate function and supplies its requested parameters. The backend validates the request, executes the function, and returns the results to Gemini. Gemini then generates the final answer.

**Best for:** A chatbot that answers different questions dynamically.

Gemini does not directly execute your JavaScript or access MongoDB. Your backend controls all database operations and permissions.

## 5. Concepts to Learn

### Essential Concepts

1. **REST APIs and asynchronous JavaScript**
   - `fetch`, HTTP methods, request/response handling
   - `async/await`, promises, `try/catch`
   - HTTP status codes and error handling

2. **MongoDB queries and aggregation**
   - Filtering transactions by user, category, and date
   - `find()`, `$match`, `$group`, `$sum`
   - Grouping expenses by month or category

3. **External API integration**
   - API keys and environment variables
   - Google's JavaScript SDK
   - Sending prompts and handling responses
   - API errors, quotas, and rate limits

4. **Prompt engineering**
   - Providing clear instructions and relevant context
   - Asking Gemini to explain supplied statistics
   - Instructing the model not to invent missing information

5. **Structured output and validation**
   - Requesting predictable JSON responses
   - Validating AI-generated fields before using them
   - Handling malformed or unexpected output

### Learn for the Chatbot

6. **Gemini function calling**
   - Function declarations and parameters
   - Handling model-requested function calls
   - Executing backend functions and returning their results
   - Validating parameters and restricting available operations

## 6. Recommended Backend Architecture

Example API routes:

| Endpoint | Purpose |
|---|---|
| `POST /api/ai/insights` | Generate spending insights |
| `POST /api/ai/summary` | Generate monthly summaries |
| `POST /api/ai/chat` | Answer questions about transactions |
| `POST /api/ai/budget-suggestions` | Suggest budgets |
| `POST /api/ai/parse-expense` | Extract fields from natural-language input |

Apply the existing `authenticate` middleware to protected routes. Identify the user using `req.user`, not a user ID supplied by the frontend.

## 7. Important Design Rules

- **Keep calculations deterministic:** Calculate totals, averages, and percentage changes in JavaScript, not through AI.
- **Protect financial data:** Send Gemini only the data needed for the request. Review Google's data-use terms before sending real users' financial records.
- **Keep the API key private:** Store it in the backend `.env` file.
- **Validate AI output:** Never assume generated text or JSON is correct.
- **Control database access:** Gemini must not receive unrestricted database access or be trusted to enforce authorization.
- **Prevent excessive requests:** Implement rate limiting, response-size limits, and sensible API usage controls.
- **Avoid unnecessary API calls:** Cache generated insights when the underlying data has not changed.

## 8. What You Don't Need Initially

You can build these features without learning:

- Python or FastAPI
- Model training or fine-tuning
- Vector databases and embeddings
- RAG (Retrieval-Augmented Generation)
- AI agent frameworks
- Machine learning mathematics

These are useful for other AI applications but are not prerequisites for integrating Gemini into TrackEx.

## Official Documentation

- [Gemini API — Get Started](https://ai.google.dev/gemini-api/docs/get-started)
- [Gemini API — Function Calling](https://ai.google.dev/gemini-api/docs/function-calling)
- [Gemini API — Structured Output](https://ai.google.dev/gemini-api/docs/structured-output)
- [Gemini API — Pricing and Data Use](https://ai.google.dev/gemini-api/docs/pricing)
