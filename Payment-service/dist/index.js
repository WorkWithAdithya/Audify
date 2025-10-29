import express from "express";
import dotenv from "dotenv";
import paymentRoutes from "./route.js";
import { sql } from "./config/db.js";
import cors from "cors";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
// Initialize database tables
async function initDB() {
    try {
        // Purchases table - tracks successful purchases
        await sql `
      CREATE TABLE IF NOT EXISTS purchases (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        song_id INTEGER NOT NULL,
        amount NUMERIC(10, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'INR',
        razorpay_order_id VARCHAR(255) NOT NULL UNIQUE,
        razorpay_payment_id VARCHAR(255),
        razorpay_signature VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
        // Transactions table - tracks all payment attempts (for analytics)
        await sql `
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        song_id INTEGER NOT NULL,
        amount NUMERIC(10, 2) NOT NULL,
        razorpay_order_id VARCHAR(255) NOT NULL,
        razorpay_payment_id VARCHAR(255),
        status VARCHAR(50) DEFAULT 'created',
        payment_method VARCHAR(100),
        error_description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
        // Create indexes for better query performance
        await sql `
      CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id)
    `;
        await sql `
      CREATE INDEX IF NOT EXISTS idx_purchases_song_id ON purchases(song_id)
    `;
        await sql `
      CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id)
    `;
        console.log("Payment database initialized successfully");
    }
    catch (error) {
        console.log("Error initializing payment DB:", error);
    }
}
app.use("/api/v1", paymentRoutes);
app.get("/", (req, res) => {
    res.send("Payment Service is running");
});
const port = process.env.PORT || 9000;
initDB().then(() => {
    app.listen(port, () => {
        console.log(`Payment service is listening on port ${port}`);
    });
});
