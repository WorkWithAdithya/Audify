import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import adminRoutes from "./route.js"
import cloudinary from "cloudinary";
import redis from 'redis';
import cors from "cors";


// ...existing code...
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
// ...existing code...

// cloudinary.v2.config({
//     // cloud_name: process.env.Cloud_Name as string, 
//     // api_key: process.env.Cloud_Api_key as string, 
//     // api_secret: process.env.Cloud_Api_secret as string
// });



const app = express();

app.use(cors());

app.use(express.json());

async function initDB() {
    try {
        await sql 
        `CREATE TABLE IF NOT EXISTS albums
        ( id SERIAL PRIMARY KEY,
         title VARCHAR(255) NOT NULL,
         description VARCHAR(255) NOT NULL,
         thumbnail VARCHAR(255) NOT NULL,
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
         )`;

        await sql 
        `CREATE TABLE IF NOT EXISTS songs
        ( id SERIAL PRIMARY KEY,
         title VARCHAR(255) NOT NULL,
         description VARCHAR(255) NOT NULL,
         thumbnail VARCHAR(255),
         audio VARCHAR(255) NOT NULL,
         album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
         )`;
         console.log("Database initialized successfully");
        
    } catch (error) {
        console.log("Error initDB", error);
    }
}

app.use("/api/v1" , adminRoutes);
const port = process.env.PORT;

initDB().then(() => {
app.listen(port , () => {
    console.log(`Admin service is listening on port ${port}` );
});

});

