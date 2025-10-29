// src/config/db.ts
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.DB_URL;
if (!dbUrl) {
  throw new Error("DB_URL environment variable is not defined");
}

export const sql = neon(dbUrl);