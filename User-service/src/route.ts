import express from "express";
import {
  addToPlaylist,
  loginUser,
  registerUser,
  getMyProfile,
  addPurchasedSong,
  checkPurchase,
  getPurchasedSongs,
} from "./controller.js";
import { isAuth } from "./middleware.js";

const router = express.Router();

// Existing routes
router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.post("/song/:id", isAuth, addToPlaylist);

// NEW: Profile route (used by other services for authentication)
router.get("/user/me", isAuth, getMyProfile);

// NEW: Purchase-related routes
router.post("/user/purchase/add", addPurchasedSong); // Called by Payment Service
router.get("/user/purchase/check/:songId", isAuth, checkPurchase);
router.get("/user/purchases", isAuth, getPurchasedSongs);

export default router;