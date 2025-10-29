import express from "express";
import {
  createOrder,
  verifyPayment,
  handleWebhook,
  getPurchaseHistory,
  getPurchaseDetails,
  getAllTransactions,
  getRevenueStats,
  createBulkOrder,
  verifyBulkPayment,
} from "./controller.js";
import { isAuth } from "./middleware.js";

const router = express.Router();

// User routes (authentication required)
router.post("/payment/create-order", isAuth, createOrder);
router.post("/payment/verify", isAuth, verifyPayment);
router.get("/payment/history", isAuth, getPurchaseHistory);
router.get("/payment/purchase/:orderId", isAuth, getPurchaseDetails);

// ✅ BULK ORDER ROUTES
router.post("/payment/create-bulk-order", isAuth, createBulkOrder);
router.post("/payment/verify-bulk", isAuth, verifyBulkPayment);

// Webhook route (no auth - uses signature verification)
router.post("/payment/webhook", handleWebhook);

// Admin routes
router.get("/payment/transactions", isAuth, getAllTransactions);
router.get("/payment/revenue-stats", isAuth, getRevenueStats);

export default router;