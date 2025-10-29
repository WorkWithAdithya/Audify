import { sql } from "./config/db.js";
import TryCatch from "./TryCatch.js";
import { redisClient } from "./index.js";
import axios from "axios";
export const getAllAlbum = TryCatch(async (req, res) => {
    let albums;
    const CACHE_EXPIRY = 1800;
    if (redisClient.isReady) {
        albums = await redisClient.get("albums");
    }
    if (albums) {
        console.log("Cache hit");
        res.json(JSON.parse(albums));
        return;
    }
    else {
        console.log("Cache miss");
        albums = await sql `SELECT * FROM albums`;
        if (redisClient.isReady) {
            await redisClient.set("albums", JSON.stringify(albums), {
                EX: CACHE_EXPIRY,
            });
        }
        res.json(albums);
        return;
    }
});
export const getAllsongs = TryCatch(async (req, res) => {
    let songs;
    const CACHE_EXPIRY = 1800;
    if (redisClient.isReady) {
        songs = await redisClient.get("songs");
    }
    if (songs) {
        console.log("Cache hit");
        res.json(JSON.parse(songs));
        return;
    }
    else {
        console.log("Cache miss");
        songs = await sql `SELECT * FROM songs`;
        if (redisClient.isReady) {
            await redisClient.set("songs", JSON.stringify(songs), {
                EX: CACHE_EXPIRY,
            });
        }
        res.json(songs);
        return;
    }
});
export const getAllSongsOfAlbum = TryCatch(async (req, res) => {
    const { id } = req.params;
    const CACHE_EXPIRY = 1800;
    let album, songs;
    if (redisClient.isReady) {
        const cacheData = await redisClient.get(`album_songs_${id}`);
        if (cacheData) {
            console.log("cache hit");
            res.json(JSON.parse(cacheData));
            return;
        }
    }
    album = await sql `SELECT * FROM albums WHERE id = ${id}`;
    if (album.length === 0) {
        res.status(404).json({
            message: "No album with this id",
        });
        return;
    }
    songs = await sql ` SELECT * FROM songs WHERE album_id = ${id}`;
    const response = { songs, album: album[0] };
    if (redisClient.isReady) {
        await redisClient.set(`album_songs_${id}`, JSON.stringify(response), {
            EX: CACHE_EXPIRY,
        });
    }
    console.log("cache miss");
    res.json(response);
});
export const getSingleSong = TryCatch(async (req, res) => {
    const song = await sql `SELECT * FROM songs WHERE id = ${req.params.id}`;
    res.json(song[0]);
});
// NEW: Get song with purchase verification (Protected Route)
export const getSongWithAuth = TryCatch(async (req, res) => {
    const songId = req.params.id;
    const userId = req.user?._id;
    if (!userId) {
        res.status(401).json({
            message: "User not authenticated",
        });
        return;
    }
    const song = await sql `SELECT * FROM songs WHERE id = ${songId}`;
    if (song.length === 0) {
        res.status(404).json({
            message: "Song not found",
        });
        return;
    }
    const songData = song[0];
    // Check if song is free (price = 0)
    if (parseFloat(songData.price) === 0) {
        res.json({
            song: songData,
            hasAccess: true,
            isPurchased: false,
            isFree: true,
        });
        return;
    }
    // Check if user has purchased the song
    try {
        const purchaseCheck = await axios.get(`${process.env.USER_SERVICE_URL}/api/v1/user/purchase/check/${songId}`, {
            headers: {
                token: req.headers.token,
            },
        });
        const hasPurchased = purchaseCheck.data.hasPurchased;
        if (hasPurchased) {
            res.json({
                song: songData,
                hasAccess: true,
                isPurchased: true,
                isFree: false,
            });
        }
        else {
            // Return song info but without audio URL
            res.json({
                song: {
                    id: songData.id,
                    title: songData.title,
                    description: songData.description,
                    thumbnail: songData.thumbnail,
                    price: songData.price,
                    album_id: songData.album_id,
                    created_at: songData.created_at,
                    // Audio URL hidden
                },
                hasAccess: false,
                isPurchased: false,
                isFree: false,
                message: "Please purchase this song to access",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Error checking purchase status",
        });
    }
});
// NEW: Stream/Download song (requires purchase for paid songs)
export const streamSong = TryCatch(async (req, res) => {
    const songId = req.params.id;
    const userId = req.user?._id;
    if (!userId) {
        res.status(401).json({
            message: "User not authenticated",
        });
        return;
    }
    const song = await sql `SELECT * FROM songs WHERE id = ${songId}`;
    if (song.length === 0) {
        res.status(404).json({
            message: "Song not found",
        });
        return;
    }
    const songData = song[0];
    // If song is free, allow streaming
    if (parseFloat(songData.price) === 0) {
        res.json({
            audioUrl: songData.audio,
            message: "Free song access granted",
        });
        return;
    }
    // Check if user has purchased the song
    try {
        const purchaseCheck = await axios.get(`${process.env.USER_SERVICE_URL}/api/v1/user/purchase/check/${songId}`, {
            headers: {
                token: req.headers.token,
            },
        });
        const hasPurchased = purchaseCheck.data.hasPurchased;
        if (hasPurchased) {
            res.json({
                audioUrl: songData.audio,
                message: "Access granted",
            });
        }
        else {
            res.status(403).json({
                message: "Please purchase this song to access audio",
                songId: songData.id,
                price: songData.price,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Error verifying purchase",
        });
    }
});
// NEW: Get user's purchased songs details
export const getMyPurchasedSongs = TryCatch(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        res.status(401).json({
            message: "User not authenticated",
        });
        return;
    }
    try {
        // Get purchased song IDs from User Service
        const purchasedResponse = await axios.get(`${process.env.USER_SERVICE_URL}/api/v1/user/purchases`, {
            headers: {
                token: req.headers.token,
            },
        });
        const purchasedSongIds = purchasedResponse.data.purchasedSongs;
        if (!purchasedSongIds || purchasedSongIds.length === 0) {
            res.json({
                songs: [],
                message: "No purchased songs",
            });
            return;
        }
        // Fetch song details for all purchased songs
        const songs = await sql `
        SELECT * FROM songs WHERE id = ANY(${purchasedSongIds}::int[])
      `;
        res.json({
            songs,
            count: songs.length,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching purchased songs",
        });
    }
});
