// src/controller.ts
import { Request } from "express";
import TryCatch from "./TryCatch.js";
import getBuffer from "./config/dataUri.js";
import cloudinary from "cloudinary";
import { sql } from "./config/db.js";
import { redisClient } from "./index.js";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
}

// util: coerce/validate price without changing your behavior
const toPrice = (value: unknown): number => {
  if (value === undefined || value === null || value === "") return NaN;
  if (typeof value === "number") return value;
  const n = parseFloat(String(value));
  return Number.isFinite(n) ? n : NaN;
};

export const addAlbum = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    return res.status(401).json({ message: "You are not admin" });
  }

  const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
  const description =
    typeof req.body?.description === "string" ? req.body.description.trim() : "";

  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "No file to upload" });
  }

  const fileBuffer = getBuffer(file);
  if (!fileBuffer || !fileBuffer.content) {
    return res.status(500).json({ message: "Failed to generate file buffer" });
  }

  // Explicit for clarity; Cloudinary default is image, but we make it clear
  const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
    folder: "albums",
    resource_type: "image",
  });

  const result = await sql`
    INSERT INTO albums (title, description, thumbnail)
    VALUES (${title}, ${description}, ${cloud.secure_url})
    RETURNING *
  `;

  if (redisClient?.isReady) {
    await redisClient.del("albums");
  }

  return res.json({
    message: "Album Created",
    album: result[0],
  });
});

export const addSong = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    return res.status(401).json({ message: "You are not admin" });
  }

  const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
  const description =
    typeof req.body?.description === "string" ? req.body.description.trim() : "";
  const album = typeof req.body?.album === "string" ? req.body.album.trim() : req.body?.album;

  // Validate required fields
  if (!title || !description || !album) {
    return res.status(400).json({
      message: "Title, description, and album are required",
    });
  }

  const isAlbum = await sql`SELECT * FROM albums WHERE id = ${album}`;
  if (isAlbum.length === 0) {
    return res.status(404).json({ message: "No album with this id" });
  }

  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "No file to upload" });
  }

  const fileBuffer = getBuffer(file);
  if (!fileBuffer || !fileBuffer.content) {
    return res.status(500).json({ message: "Failed to generate file buffer" });
  }

  // Critical for audio in Cloudinary: use 'video' pipeline
  const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
    folder: "songs",
    resource_type: "video",
  });

  // Keep your original price logic (default 0.0 if not sent)
  const songPrice = req.body?.price !== undefined ? toPrice(req.body.price) : 0.0;
  if (!Number.isFinite(songPrice) || songPrice < 0) {
    return res.status(400).json({ message: "Invalid price value" });
  }

  const result = await sql`
    INSERT INTO songs (title, description, audio, album_id, price)
    VALUES (${title}, ${description}, ${cloud.secure_url}, ${album}, ${songPrice})
    RETURNING *
  `;

  if (redisClient?.isReady) {
    await redisClient.del("songs");
  }

  return res.json({
    message: "Song Added",
    song: result[0],
  });
});

export const addThumbnail = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    return res.status(401).json({ message: "You are not admin" });
  }

  const songId = typeof req.params?.id === "string" ? req.params.id.trim() : req.params?.id;

  const song = await sql`SELECT * FROM songs WHERE id = ${songId}`;
  if (song.length === 0) {
    return res.status(404).json({ message: "No song with this id" });
  }

  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "No file to upload" });
  }

  const fileBuffer = getBuffer(file);
  if (!fileBuffer || !fileBuffer.content) {
    return res.status(500).json({ message: "Failed to generate file buffer" });
  }

  const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content);

  const result = await sql`
    UPDATE songs
    SET thumbnail = ${cloud.secure_url}
    WHERE id = ${songId}
    RETURNING *
  `;

  if (redisClient?.isReady) {
    await redisClient.del("songs");
  }

  return res.json({
    message: "Thumbnail added",
    song: result[0],
  });
});

export const updateSongPrice = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    return res.status(401).json({ message: "You are not admin" });
  }

  const id = typeof req.params?.id === "string" ? req.params.id.trim() : req.params?.id;
  const { price } = req.body;

  if (price === undefined || price === null) {
    return res.status(400).json({ message: "Price is required" });
  }

  const songPrice = toPrice(price);
  if (!Number.isFinite(songPrice) || songPrice < 0) {
    return res.status(400).json({ message: "Invalid price value" });
  }

  const song = await sql`SELECT * FROM songs WHERE id = ${id}`;
  if (song.length === 0) {
    return res.status(404).json({ message: "No song with this id" });
  }

  const result = await sql`
    UPDATE songs
    SET price = ${songPrice}
    WHERE id = ${id}
    RETURNING *
  `;

  if (redisClient?.isReady) {
    await redisClient.del("songs");
  }

  return res.json({
    message: "Song price updated",
    song: result[0],
  });
});

export const deleteAlbum = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    return res.status(401).json({ message: "You are not admin" });
  }

  const id = typeof req.params?.id === "string" ? req.params.id.trim() : req.params?.id;

  const isAlbum = await sql`SELECT * FROM albums WHERE id = ${id}`;
  if (isAlbum.length === 0) {
    return res.status(404).json({ message: "No album with this id" });
  }

  // Keep your cascade behavior (delete songs then album)
  await sql`DELETE FROM songs WHERE album_id = ${id}`;
  await sql`DELETE FROM albums WHERE id = ${id}`;

  if (redisClient?.isReady) {
    await redisClient.del("albums");
    await redisClient.del("songs");
  }

  return res.json({ message: "Album deleted successfully" });
});

export const deleteSong = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    return res.status(401).json({ message: "You are not admin" });
  }

  const id = typeof req.params?.id === "string" ? req.params.id.trim() : req.params?.id;

  const song = await sql`SELECT * FROM songs WHERE id = ${id}`;
  if (song.length === 0) {
    return res.status(404).json({ message: "No song with this id" });
  }

  await sql`DELETE FROM songs WHERE id = ${id}`;

  if (redisClient?.isReady) {
    await redisClient.del("songs");
  }

  return res.json({ message: "Song deleted successfully" });
});