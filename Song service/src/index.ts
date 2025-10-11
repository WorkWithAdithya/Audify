import express from 'express';
import dotenv from 'dotenv';
import songRoutes from './route.js';
import redis from 'redis';
import cors from 'cors';

dotenv.config();

export const redisClient = redis.createClient({
  password: process.env.Redis_Password || "",
  socket: {
    host: "redis-17220.crce217.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 17220,
  }
});

redisClient.connect().then(() => {
  console.log("Connected to Redis");
}).catch((err) => {
  console.error("Redis connection error:", err);
});


const app = express();

app.use(cors());

app.use("/api/v1", songRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Song service is running on port ${PORT}`);
});