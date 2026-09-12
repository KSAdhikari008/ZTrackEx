# 8. Version control habits

## .gitignore setup

- separate `.gitignore` for frontend and backend with a main `.gitignore` in the root.
- put Todo.md in `.gitignore`.

## commit msg types

feat: add User model with password hashing
fix: prevent double password hashing on update
chore: set up mongoose connection and .env
refactor: centralize error handling middleware
docs: add API route list to README
style: fix indentation in expenseController
perf: add compound index on userId and date (performance related)