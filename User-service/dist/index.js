import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./route.js";
import cors from "cors";
dotenv.config();
const connectDb = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error("MONGO_URI is not defined");
            process.exit(1);
        }
        await mongoose.connect(uri, {
            dbName: "Spotify",
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
        });
        console.log("Mongo Db Connected");
    }
    catch (error) {
        console.error("Mongo connection error:", error);
        process.exit(1);
    }
};
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1", userRoutes);
app.get("/", (req, res) => {
    res.send("Server is working");
});
const port = process.env.PORT || 5000;
const start = async () => {
    await connectDb();
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};
start().catch((e) => {
    console.error("Startup error:", e);
    process.exit(1);
});
