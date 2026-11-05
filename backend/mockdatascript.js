import "dotenv/config";
import dns from "node:dns"; // Development-only workaround for local DNS issues.
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import { category } from "./src/constants/category.js";
import { Expense } from "./src/models/expense.model.js";
import { User } from "./src/models/user.model.js";

const TOTAL_EXPENSES = 30;
const end = new Date(); // till now
const start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1)); // Start of the current month

if (process.env.NODE_ENV === "development") {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

async function generateMockExpenses() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Mock expense generation is disabled in production.");
  }

  if (process.env.ALLOW_MOCK_DATA !== "true") {
    throw new Error("Set ALLOW_MOCK_DATA=true to proceed.");
  }

  const userId = process.env.MOCK_USER_ID?.trim();

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI must be set in the backend .env file.");
  }

  if (!userId || !/^[a-f\d]{24}$/i.test(userId)) {
    throw new Error("Set MOCK_USER_ID to a valid MongoDB ObjectId in the backend .env file.");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const user = await User.findById(userId).select("_id");

    if (!user) {
      throw new Error(`No user found with ID ${userId}.`);
    }

    const expenses = Array.from({ length: TOTAL_EXPENSES }, () => ({
      title: faker.commerce.productName(),
      amount: faker.number.int({ min: 100, max: 100000 }),
      category: faker.helpers.arrayElement(category),
      date: faker.date.between({ from: start, to: end }),
      user: user._id,
    }));

    const insertedExpenses = await Expense.insertMany(expenses);

    console.log(`Inserted ${insertedExpenses.length} mock expenses for user ${userId}.`);
  } finally {
    await mongoose.disconnect();
  }
}

generateMockExpenses().catch((error) => {
  console.error("Mock expense generation failed:", error);
  process.exitCode = 1;
});
