import { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import axios from "axios";
import TryCatch from "./TryCatch.js";
import { sql } from "./config/db.js";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}

// Helper functions for environment variables
const getRazorpayKeyId = (): string => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  if (!keyId) throw new Error("RAZORPAY_KEY_ID not defined");
  return keyId;
};

const getRazorpayKeySecret = (): string => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) throw new Error("RAZORPAY_KEY_SECRET not defined");
  return keySecret;
};

const getSongServiceUrl = (): string => {
  const url = process.env.SONG_SERVICE_URL;
  if (!url) throw new Error("SONG_SERVICE_URL not defined");
  return url;
};

const getUserServiceUrl = (): string => {
  const url = process.env.USER_SERVICE_URL;
  if (!url) throw new Error("USER_SERVICE_URL not defined");
  return url;
};

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: getRazorpayKeyId(),
  key_secret: getRazorpayKeySecret(),
});

// NEW: Create bulk order for multiple songs
export const createBulkOrder = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    console.log("=== CREATE BULK ORDER START ===");
    const { songIds } = req.body;
    const userId = req.user?._id;

    console.log("User ID:", userId);
    console.log("Song IDs received:", songIds);

    if (!userId) {
      console.log("❌ No user ID - unauthorized");
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    if (!songIds || !Array.isArray(songIds) || songIds.length === 0) {
      console.log("❌ Invalid songIds:", songIds);
      res.status(400).json({ message: "Song IDs array is required" });
      return;
    }

    try {
      // Check for already purchased songs
      console.log("Checking for existing purchases...");
      const alreadyPurchased = await sql`
        SELECT song_id FROM purchases 
        WHERE user_id = ${userId} 
        AND song_id = ANY(${songIds}::int[])
        AND status = 'completed'
      `;

      if (alreadyPurchased.length > 0) {
        const purchasedIds = alreadyPurchased.map((p: any) => p.song_id);
        console.log("❌ Already purchased:", purchasedIds);
        res.status(400).json({
          message: "Some songs are already purchased",
          purchasedSongIds: purchasedIds,
        });
        return;
      }

      // Fetch all songs details
      console.log("Fetching song details from Song Service...");
      console.log("Song Service URL:", getSongServiceUrl());
      
      const songsData = await Promise.all(
        songIds.map(async (songId: string) => {
          const url = `${getSongServiceUrl()}/api/v1/song/${songId}`;
          console.log(`Fetching song: ${url}`);
          
          const songResponse = await axios.get(url);
          console.log(`✅ Song ${songId} fetched:`, songResponse.data);
          return songResponse.data;
        })
      );

      console.log("All songs fetched successfully:", songsData.length);

      // Calculate total amount
      const totalAmount = songsData.reduce((sum, song) => {
        const price = parseFloat(song.price || 0);
        console.log(`Song ${song.id} price: ${price}`);
        return sum + price;
      }, 0);

      console.log("Total amount calculated:", totalAmount);

      if (totalAmount <= 0) {
        console.log("❌ All songs are free");
        res.status(400).json({ message: "All songs are free" });
        return;
      }

      // Create Razorpay order with better error handling
      console.log("Creating Razorpay order...");
      console.log("Razorpay Key ID:", getRazorpayKeyId());
      
      const options = {
        amount: Math.round(totalAmount * 100), // Convert to paise
        currency: "INR",
        receipt: `bulk_${Date.now()}`,
        notes: {
          userId,
          songIds: songIds.join(","),
          itemCount: songIds.length.toString(),
        },
      };

      console.log("Razorpay options:", options);
      
      let order;
      try {
        order = await razorpay.orders.create(options);
        console.log("✅ Razorpay order created:", order);
      } catch (razorpayError: any) {
        console.error("❌ Razorpay API Error:");
        console.error("Error object:", razorpayError);
        console.error("Error message:", razorpayError.message);
        console.error("Error description:", razorpayError.description);
        console.error("Error statusCode:", razorpayError.statusCode);
        console.error("Error error:", razorpayError.error);
        
        // Return detailed error to frontend
        res.status(500).json({
          message: "Razorpay order creation failed",
          error: razorpayError.message || "Unknown Razorpay error",
          description: razorpayError.description || razorpayError.error?.description,
          statusCode: razorpayError.statusCode,
          hint: "Check Razorpay credentials and account status"
        });
        return;
      }

      // Save transaction for bulk order
      console.log("Saving transaction to database...");
      await sql`
        INSERT INTO transactions (user_id, song_id, amount, razorpay_order_id, status)
        VALUES (${userId}, ${songIds[0]}, ${totalAmount}, ${order.id}, 'created')
      `;
      console.log("✅ Transaction saved");

      // Save pending purchases for all songs
      console.log("Saving pending purchases...");
      for (const songId of songIds) {
        const song = songsData.find((s) => s.id.toString() === songId.toString());
        const songAmount = song ? parseFloat(song.price || 0) : 0;

        await sql`
          INSERT INTO purchases (user_id, song_id, amount, razorpay_order_id, status)
          VALUES (${userId}, ${songId}, ${songAmount}, ${order.id}, 'pending')
        `;
        console.log(`✅ Pending purchase saved for song ${songId}`);
      }

      console.log("=== CREATE BULK ORDER SUCCESS ===");
      res.json({
        success: true,
        order,
        songs: songsData,
        totalAmount,
        key: getRazorpayKeyId(),
      });
    } catch (error: any) {
      console.error("=== CREATE BULK ORDER ERROR ===");
      console.error("Error type:", error.constructor?.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      console.error("Full error object:", JSON.stringify(error, null, 2));
      
      res.status(500).json({
        message: "Error creating bulk order",
        error: error.message || "Unknown error",
        details: error.response?.data || error.toString(),
      });
    }
  }
);

// Keep all your other existing functions below (verifyBulkPayment, createOrder, verifyPayment, etc.)
// I'm only showing the createBulkOrder with debug logging

// NEW: Verify bulk payment and add all songs to user
export const verifyBulkPayment = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({ message: "Missing payment details" });
      return;
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", getRazorpayKeySecret())
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      // Update all purchases as failed
      await sql`
        UPDATE purchases 
        SET status = 'failed'
        WHERE razorpay_order_id = ${razorpay_order_id}
      `;

      res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
      return;
    }

    // Payment verified - update all purchases for this order
    const purchases = await sql`
      UPDATE purchases 
      SET status = 'completed',
          razorpay_payment_id = ${razorpay_payment_id},
          razorpay_signature = ${razorpay_signature},
          updated_at = CURRENT_TIMESTAMP
      WHERE razorpay_order_id = ${razorpay_order_id}
      RETURNING *
    `;

    if (purchases.length === 0) {
      res.status(404).json({ message: "Purchases not found" });
      return;
    }

    // Update transaction as success
    await sql`
      UPDATE transactions 
      SET status = 'success',
          razorpay_payment_id = ${razorpay_payment_id}
      WHERE razorpay_order_id = ${razorpay_order_id}
    `;

    // Add all songs to user's purchased songs in User Service
    try {
      for (const purchase of purchases) {
        await axios.post(
          `${getUserServiceUrl()}/api/v1/user/purchase/add`,
          {
            userId: purchase.user_id,
            songId: purchase.song_id.toString(),
          }
        );
      }

      res.json({
        success: true,
        message: "Payment verified successfully",
        purchases,
        count: purchases.length,
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Payment verified but failed to update user",
        error: error.message,
      });
    }
  }
);

// Create Order for Song Purchase
export const createOrder = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const { songId } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    if (!songId) {
      res.status(400).json({ message: "Song ID is required" });
      return;
    }

    // Check if user already purchased this song
    const existingPurchase = await sql`
      SELECT * FROM purchases 
      WHERE user_id = ${userId} 
      AND song_id = ${songId} 
      AND status = 'completed'
    `;

    if (existingPurchase.length > 0) {
      res.status(400).json({
        message: "You have already purchased this song",
      });
      return;
    }

    // Fetch song details from Song Service
    try {
      const songResponse = await axios.get(
        `${getSongServiceUrl()}/api/v1/song/${songId}`
      );

      const song = songResponse.data;

      if (!song) {
        res.status(404).json({ message: "Song not found" });
        return;
      }

      const amount = parseFloat(song.price);

      if (amount <= 0) {
        res.status(400).json({ message: "This song is free" });
        return;
      }

      // Create Razorpay order
      const options = {
        amount: Math.round(amount * 100), // Convert to paise
        currency: "INR",
        receipt: `bulk_${Date.now()}`,
        notes: {
          userId,
          songId: songId.toString(),
          songTitle: song.title,
        },
      };

      const order = await razorpay.orders.create(options);

      // Save transaction to database
      await sql`
        INSERT INTO transactions (user_id, song_id, amount, razorpay_order_id, status)
        VALUES (${userId}, ${songId}, ${amount}, ${order.id}, 'created')
      `;

      // Save pending purchase
      await sql`
        INSERT INTO purchases (user_id, song_id, amount, razorpay_order_id, status)
        VALUES (${userId}, ${songId}, ${amount}, ${order.id}, 'pending')
      `;

      res.json({
        success: true,
        order,
        song: {
          id: song.id,
          title: song.title,
          price: song.price,
        },
        key: getRazorpayKeyId(),
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Error creating order",
        error: error.message,
      });
    }
  }
);

// Verify Payment
export const verifyPayment = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({ message: "Missing payment details" });
      return;
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", getRazorpayKeySecret())
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      // Update transaction as failed
      await sql`
        UPDATE transactions 
        SET status = 'failed', error_description = 'Invalid signature'
        WHERE razorpay_order_id = ${razorpay_order_id}
      `;

      res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
      return;
    }

    // Payment verified - update purchase status
    const purchase = await sql`
      UPDATE purchases 
      SET status = 'completed',
          razorpay_payment_id = ${razorpay_payment_id},
          razorpay_signature = ${razorpay_signature},
          updated_at = CURRENT_TIMESTAMP
      WHERE razorpay_order_id = ${razorpay_order_id}
      RETURNING *
    `;

    if (purchase.length === 0) {
      res.status(404).json({ message: "Purchase not found" });
      return;
    }

    const purchaseData = purchase[0];

    if (!purchaseData) {
      res.status(500).json({ message: "Failed to retrieve purchase data" });
      return;
    }

    // Update transaction as success
    await sql`
      UPDATE transactions 
      SET status = 'success',
          razorpay_payment_id = ${razorpay_payment_id}
      WHERE razorpay_order_id = ${razorpay_order_id}
    `;

    // Add song to user's purchased songs in User Service
    try {
      await axios.post(
        `${getUserServiceUrl()}/api/v1/user/purchase/add`,
        {
          userId: purchaseData.user_id,
          songId: purchaseData.song_id.toString(),
        }
      );

      res.json({
        success: true,
        message: "Payment verified successfully",
        purchase: purchaseData,
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Payment verified but failed to update user",
        error: error.message,
      });
    }
  }
);

// Webhook handler for Razorpay events
export const handleWebhook = TryCatch(async (req: Request, res: Response) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    res.status(500).json({ message: "Webhook secret not configured" });
    return;
  }

  const signature = req.headers["x-razorpay-signature"] as string;

  // Verify webhook signature
  const generatedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (generatedSignature !== signature) {
    res.status(400).json({ message: "Invalid webhook signature" });
    return;
  }

  const event = req.body.event;
  const payload = req.body.payload.payment.entity;

  console.log("Webhook event:", event);

  // Handle different webhook events
  switch (event) {
    case "payment.captured":
      // Payment successful - already handled in verifyPayment
      console.log("Payment captured:", payload.id);
      break;

    case "payment.failed":
      // Update transaction as failed
      await sql`
        UPDATE transactions 
        SET status = 'failed',
            error_description = ${payload.error_description || "Payment failed"}
        WHERE razorpay_order_id = ${payload.order_id}
      `;

      await sql`
        UPDATE purchases 
        SET status = 'failed'
        WHERE razorpay_order_id = ${payload.order_id}
      `;
      break;

    default:
      console.log("Unhandled webhook event:", event);
  }

  res.json({ received: true });
});

// Get user's purchase history
export const getPurchaseHistory = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const purchases = await sql`
      SELECT * FROM purchases 
      WHERE user_id = ${userId} 
      AND status = 'completed'
      ORDER BY created_at DESC
    `;

    // Fetch song details for each purchase
    const purchasesWithSongs = await Promise.all(
      purchases.map(async (purchase) => {
        try {
          const songResponse = await axios.get(
            `${getSongServiceUrl()}/api/v1/song/${purchase.song_id}`
          );
          return {
            ...purchase,
            song: songResponse.data,
          };
        } catch (error) {
          return {
            ...purchase,
            song: null,
          };
        }
      })
    );

    res.json({
      purchases: purchasesWithSongs,
      count: purchases.length,
    });
  }
);

// Get single purchase details
export const getPurchaseDetails = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;
    const { orderId } = req.params;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const purchase = await sql`
      SELECT * FROM purchases 
      WHERE user_id = ${userId} 
      AND razorpay_order_id = ${orderId}
    `;

    if (purchase.length === 0) {
      res.status(404).json({ message: "Purchase not found" });
      return;
    }

    const purchaseData = purchase[0];

    if (!purchaseData) {
      res.status(500).json({ message: "Failed to retrieve purchase data" });
      return;
    }

    // Fetch song details
    try {
      const songResponse = await axios.get(
        `${getSongServiceUrl()}/api/v1/song/${purchaseData.song_id}`
      );

      res.json({
        purchase: {
          ...purchaseData,
          song: songResponse.data,
        },
      });
    } catch (error) {
      res.json({
        purchase: {
          ...purchaseData,
          song: null,
        },
      });
    }
  }
);

// Admin: Get all transactions
export const getAllTransactions = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    if (req.user?.role !== "admin") {
      res.status(403).json({ message: "Admin access required" });
      return;
    }

    const { page = 1, limit = 20, status } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let transactions;
    let totalCount;

    if (status) {
      transactions = await sql`
        SELECT * FROM transactions 
        WHERE status = ${status as string}
        ORDER BY created_at DESC 
        LIMIT ${Number(limit)} OFFSET ${offset}
      `;

      totalCount = await sql`
        SELECT COUNT(*) FROM transactions WHERE status = ${status as string}
      `;
    } else {
      transactions = await sql`
        SELECT * FROM transactions 
        ORDER BY created_at DESC 
        LIMIT ${Number(limit)} OFFSET ${offset}
      `;

      totalCount = await sql`SELECT COUNT(*) FROM transactions`;
    }

    const countData = totalCount[0];

    if (!countData) {
      res.status(500).json({ message: "Failed to retrieve count" });
      return;
    }

    res.json({
      transactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(countData.count),
        pages: Math.ceil(Number(countData.count) / Number(limit)),
      },
    });
  }
);

// Admin: Get revenue statistics
export const getRevenueStats = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    if (req.user?.role !== "admin") {
      res.status(403).json({ message: "Admin access required" });
      return;
    }

    // Total revenue
    const totalRevenue = await sql`
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM purchases 
      WHERE status = 'completed'
    `;

    // Monthly revenue (current month)
    const monthlyRevenue = await sql`
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM purchases 
      WHERE status = 'completed' 
      AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
    `;

    // Total successful purchases
    const totalPurchases = await sql`
      SELECT COUNT(*) as count 
      FROM purchases 
      WHERE status = 'completed'
    `;

    // Top selling songs
    const topSongs = await sql`
      SELECT song_id, COUNT(*) as purchase_count, SUM(amount) as revenue
      FROM purchases 
      WHERE status = 'completed'
      GROUP BY song_id 
      ORDER BY purchase_count DESC 
      LIMIT 10
    `;

    const revenueData = totalRevenue[0];
    const monthlyData = monthlyRevenue[0];
    const purchaseData = totalPurchases[0];

    if (!revenueData || !monthlyData || !purchaseData) {
      res.status(500).json({ message: "Failed to retrieve statistics" });
      return;
    }

    res.json({
      totalRevenue: revenueData.total,
      monthlyRevenue: monthlyData.total,
      totalPurchases: purchaseData.count,
      topSongs,
    });
  }
);