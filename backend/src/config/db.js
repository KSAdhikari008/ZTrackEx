import dns from "node:dns"; // Development-only workaround for local DNS issues.
import mongoose from "mongoose";

if (process.env.NODE_ENV === "development") {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

export default async function connectDB() {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connection successful:",connectionInstance.connection.host);
}

// Error handling is done in server.js