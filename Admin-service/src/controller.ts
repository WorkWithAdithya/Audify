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

export const addAlbum = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    res.status(401).json({
      message: "You are not admin",
    });
    return;
  }

  const { title, description } = req.body;

  const file = req.file;

  if (!file) {
    res.status(400).json({
      message: "No file to upload",
    });
    return;
  }

  const fileBuffer = getBuffer(file);

  if (!fileBuffer || !fileBuffer.content) {
    res.status(500).json({
      message: "Failed to generate file buffer",
    });
    return;
  }

  const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
    folder: "albums",
  });

  const result = await sql`
   INSERT INTO albums (title, description, thumbnail) 
   VALUES (${title}, ${description}, ${cloud.secure_url}) 
   RETURNING *
  `;

  if (redisClient.isReady) {
    await redisClient.del("albums");
    console.log("Cache invalidated for albums");
  }

  res.json({
    message: "Album Created",
    album: result[0],
  });
});

export const addSong = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    res.status(401).json({
      message: "You are not admin",
    });
    return;
  }

  const { title, description, album, price } = req.body;

  // Validate required fields
  if (!title || !description || !album) {
    res.status(400).json({
      message: "Title, description, and album are required",
    });
    return;
  }

  const isAlbum = await sql`SELECT * FROM albums WHERE id = ${album}`;

  if (isAlbum.length === 0) {
    res.status(404).json({
      message: "No album with this id",
    });
    return;
  }

  const file = req.file;

  if (!file) {
    res.status(400).json({
      message: "No file to upload",
    });
    return;
  }

  const fileBuffer = getBuffer(file);

  if (!fileBuffer || !fileBuffer.content) {
    res.status(500).json({
      message: "Failed to generate file buffer",
    });
    return;
  }

  const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
    folder: "songs",
    resource_type: "video",
  });

  // Parse and validate price
  const songPrice = price ? parseFloat(price) : 0.0;
  
  if (isNaN(songPrice) || songPrice < 0) {
    res.status(400).json({
      message: "Invalid price value",
    });
    return;
  }

  const result = await sql`
    INSERT INTO songs (title, description, audio, album_id, price) 
    VALUES (${title}, ${description}, ${cloud.secure_url}, ${album}, ${songPrice})
    RETURNING *
  `;

  // CRITICAL FIX: Clear both general songs cache AND album-specific cache
  if (redisClient.isReady) {
    await redisClient.del("songs");
    await redisClient.del(`album_songs_${album}`); // This is the key fix!
    console.log(`Cache invalidated for songs and album_songs_${album}`);
  }

  res.json({
    message: "Song Added",
    song: result[0],
  });
});

export const addThumbnail = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    res.status(401).json({
      message: "You are not admin",
    });
    return;
  }

  const song = await sql`SELECT * FROM songs WHERE id = ${req.params.id}`;

  if (song.length === 0) {
    res.status(404).json({
      message: "No song with this id",
    });
    return;
  }

  const file = req.file;

  if (!file) {
    res.status(400).json({
      message: "No file to upload",
    });
    return;
  }

  const fileBuffer = getBuffer(file);

  if (!fileBuffer || !fileBuffer.content) {
    res.status(500).json({
      message: "Failed to generate file buffer",
    });
    return;
  }

  const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content);

  const result = await sql`
    UPDATE songs SET thumbnail = ${cloud.secure_url} 
    WHERE id = ${req.params.id} 
    RETURNING *
  `;

  // Clear cache for the album this song belongs to
  const songData = song[0];
  if (redisClient.isReady) {
    await redisClient.del("songs");
    if (songData?.album_id) {
      await redisClient.del(`album_songs_${songData.album_id}`);
    }
    console.log("Cache invalidated for songs");
  }

  res.json({
    message: "Thumbnail added",
    song: result[0],
  });
});

export const updateSongPrice = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    if (req.user?.role !== "admin") {
      res.status(401).json({
        message: "You are not admin",
      });
      return;
    }

    const { id } = req.params;
    const { price } = req.body;

    if (price === undefined || price === null) {
      res.status(400).json({
        message: "Price is required",
      });
      return;
    }

    const songPrice = parseFloat(price);

    if (isNaN(songPrice) || songPrice < 0) {
      res.status(400).json({
        message: "Invalid price value",
      });
      return;
    }

    const song = await sql`SELECT * FROM songs WHERE id = ${id}`;

    if (song.length === 0) {
      res.status(404).json({
        message: "No song with this id",
      });
      return;
    }

    const result = await sql`
      UPDATE songs SET price = ${songPrice} 
      WHERE id = ${id} 
      RETURNING *
    `;

    // Clear cache for the album this song belongs to
    const songData = song[0];
    if (redisClient.isReady) {
      await redisClient.del("songs");
      if (songData?.album_id) {
        await redisClient.del(`album_songs_${songData.album_id}`);
      }
      console.log("Cache invalidated for songs");
    }

    res.json({
      message: "Song price updated",
      song: result[0],
    });
  }
);

export const deleteAlbum = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    res.status(401).json({
      message: "You are not admin",
    });
    return;
  }

  const { id } = req.params;

  const isAlbum = await sql`SELECT * FROM albums WHERE id = ${id}`;

  if (isAlbum.length === 0) {
    res.status(404).json({
      message: "No album with this id",
    });
    return;
  }

  await sql`DELETE FROM songs WHERE album_id = ${id}`;
  await sql`DELETE FROM albums WHERE id = ${id}`;

  if (redisClient.isReady) {
    await redisClient.del("albums");
    await redisClient.del("songs");
    await redisClient.del(`album_songs_${id}`); // Clear album-specific cache
    console.log("Cache invalidated for albums and songs");
  }

  res.json({
    message: "Album deleted successfully",
  });
});

export const deleteSong = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    res.status(401).json({
      message: "You are not admin",
    });
    return;
  }

  const { id } = req.params;

  const song = await sql`SELECT * FROM songs WHERE id = ${id}`;

  if (song.length === 0) {
    res.status(404).json({
      message: "No song with this id",
    });
    return;
  }

  const songData = song[0];

  await sql`DELETE FROM songs WHERE id = ${id}`;

  if (redisClient.isReady) {
    await redisClient.del("songs");
    if (songData?.album_id) {
      await redisClient.del(`album_songs_${songData.album_id}`); // Clear album-specific cache
    }
    console.log("Cache invalidated for songs");
  }
  
  res.json({
    message: "Song deleted successfully",
  });
});