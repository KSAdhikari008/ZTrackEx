import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

//Routes

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API"
    });
});

export default app;