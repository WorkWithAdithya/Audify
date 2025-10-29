import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import adminRoutes from "./route.js"
import cloudinary from "cloudinary";
import redis from 'redis';
import cors from "cors";

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

const { Cloud_Name, Cloud_Api_key, Cloud_Api_secret } = process.env;

if (!Cloud_Name || !Cloud_Api_key || !Cloud_Api_secret) {
  throw new Error("Missing Cloudinary environment variables!");
}

cloudinary.v2.config({
  cloud_name: Cloud_Name,
  api_key: Cloud_Api_key,
  api_secret: Cloud_Api_secret
});

const app = express();
app.use(cors());
app.use(express.json());

async function initDB() {
    try {
        // Create albums table
        await sql`
          CREATE TABLE IF NOT EXISTS albums (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            thumbnail VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;

        // Create songs table with price column
        await sql`
          CREATE TABLE IF NOT EXISTS songs (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            thumbnail VARCHAR(255),
            audio VARCHAR(255) NOT NULL,
            price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
            album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;

        // Add price column if it doesn't exist (for existing databases)
        await sql`
          DO $$ 
          BEGIN 
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'songs' AND column_name = 'price'
            ) THEN 
              ALTER TABLE songs ADD COLUMN price NUMERIC(10, 2) NOT NULL DEFAULT 0.00;
            END IF;
          END $$;
        `;

        console.log("Database initialized successfully");
        
    } catch (error) {
        console.log("Error initDB", error);
    }
}

app.use("/api/v1", adminRoutes);
const port = process.env.PORT || 7000;

initDB().then(() => {
  app.listen(port, () => {
    console.log(`Admin service is listening on port ${port}`);
  });
});