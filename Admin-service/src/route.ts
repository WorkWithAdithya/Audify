import express from "express";
import uploadFile, { isAuth } from "./middleware.js";
import {
  addAlbum,
  addSong,
  addThumbnail,
  deleteAlbum,
  deleteSong,
  updateSongPrice,
} from "./controller.js";

const router = express.Router();

// Existing routes
router.post("/album/new", isAuth, uploadFile, addAlbum);
router.post("/song/new", isAuth, uploadFile, addSong);
router.post("/song/:id", isAuth, uploadFile, addThumbnail);
router.delete("/album/:id", isAuth, deleteAlbum);
router.delete("/song/:id", isAuth, deleteSong);

// NEW: Update song price route
router.patch("/song/:id/price", isAuth, updateSongPrice);

export default router;