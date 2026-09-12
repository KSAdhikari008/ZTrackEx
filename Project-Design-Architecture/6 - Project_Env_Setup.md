# 6. Seting up environment and config

- `.gitignore` the `.env` file for secrets (Mongo URI, JWT secret) before the first commit.
- Separate configs for development vs production.


## NODE_ENV specifically

NODE_ENV is a conventional variable (not MERN-specific, it's a broader Node ecosystem convention) that's either "development" or "production", and we can branch our own logic on it too. Express and many libraries check it directly. This is the actual mechanism behind "detailed vs generic error responses" from the table above:

js
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
};

In dev, we get the full stack trace in the response to help us debug. In prod, stack is undefined and never gets sent to real users — we don't want to expose internal file paths/line numbers to the public.

`message ` gives what went wrong, `stack` tells where.


## .env (local development)
PORT=5000
MONGO_URI=mongodb://localhost:27017/expense-tracker-dev
JWT_SECRET=devsecret123
CLIENT_URL=http://localhost:5173
NODE_ENV=development

## Set on your hosting platform (Render/Railway/etc.), not in a committed file
PORT=(assigned automatically by host)
MONGO_URI=mongodb+srv://realuser:realpass@cluster.mongodb.net/expense-tracker
JWT_SECRET=<a long random production secret>
CLIENT_URL=https://deployed-frontend.com
NODE_ENV=production