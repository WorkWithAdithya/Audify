import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./route.js";

dotenv.config();

const app = express();

// 🔹 Middleware to parse JSON
app.use(express.json());

// 🔹 Mount API routes
app.use("/api/v1", userRoutes);

// 🔹 Root endpoint
app.get("/", (req, res) => res.send("Server working!"));

// 🔹 Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string, {
            dbName: "Audify"
        });
        console.log("✅ MongoDB connected");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    }
};

// 🔹 Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    connectDB();
});
