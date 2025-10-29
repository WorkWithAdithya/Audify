import express from "express";
import dotenv from "dotenv";
import songRoutes from "./route.js";
import redis from "redis";
import cors from "cors";
dotenv.config();
export const redisClient = redis.createClient({
    password: process.env.Redis_Password || "",
    socket: {
        host: "redis-17220.crce217.ap-south-1-1.ec2.redns.redis-cloud.com",
        port: 17220,
    },
});
redisClient
    .connect()
    .then(() => console.log("Connected to redis"))
    .catch(console.error);
const app = express();
app.use(cors());
app.use(express.json()); // NEW: Added express.json() middleware
app.use("/api/v1", songRoutes);
app.get("/", (req, res) => {
    res.send("Song Service is running");
});
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Song service is running on port ${port}`);
});
