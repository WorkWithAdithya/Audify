import express from "express";
import {
  getAllAlbum,
  getAllsongs,
  getAllSongsOfAlbum,
  getSingleSong,
  getSongWithAuth,
  streamSong,
  getMyPurchasedSongs,
} from "./controller.js";
import { isAuth } from "./middleware.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/album/all", getAllAlbum);
router.get("/song/all", getAllsongs);
router.get("/album/:id", getAllSongsOfAlbum);
router.get("/song/:id", getSingleSong); // Public - shows basic info

// NEW: Protected routes (authentication required)
router.get("/song/:id/details", isAuth, getSongWithAuth); // Check purchase status
router.get("/song/:id/stream", isAuth, streamSong); // Stream/download with purchase check
router.get("/my/purchased", isAuth, getMyPurchasedSongs); // Get user's purchased songs

export default router;