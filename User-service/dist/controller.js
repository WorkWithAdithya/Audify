import { User } from "./model.js";
import TryCatch from "./trycatch.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// Helper function to get JWT secret
const getJwtSecret = () => {
    const secret = process.env.JWT_SEC || process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SEC/JWT_SECRET environment variable is not defined");
    }
    return secret;
};
// Normalize email for consistency
const normEmail = (email) => (email || "").trim().toLowerCase();
// Remove sensitive fields before responding
const sanitize = (u) => {
    const obj = u?.toObject ? u.toObject() : { ...u };
    if (obj?.password)
        delete obj.password;
    return obj;
};
export const registerUser = TryCatch(async (req, res) => {
    const { name, email, password } = req.body;
    const normalizedEmail = normEmail(email);
    let user = await User.findOne({ email: normalizedEmail });
    if (user) {
        res.status(400).json({
            message: "User Already exists",
        });
        return;
    }
    const hashPassword = await bcrypt.hash(password, 10);
    user = await User.create({
        name,
        email: normalizedEmail,
        password: hashPassword,
    });
    const token = jwt.sign({ _id: user._id }, getJwtSecret(), {
        expiresIn: "7d",
    });
    res.status(201).json({
        message: "User Registered",
        user: sanitize(user),
        token,
    });
});
export const loginUser = TryCatch(async (req, res) => {
    const { email, password } = req.body;
    const normalizedEmail = normEmail(email);
    // Because password is select:false in model, explicitly select it here
    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user) {
        res.status(404).json({
            message: "User not exists",
        });
        return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(400).json({
            message: "Invalid Password",
        });
        return;
    }
    const token = jwt.sign({ _id: user._id }, getJwtSecret(), {
        expiresIn: "7d",
    });
    res.status(200).json({
        message: "Logged IN",
        user: sanitize(user),
        token,
    });
});
export const addToPlaylist = TryCatch(async (req, res) => {
    const userId = req.user?._id;
    const songId = req.params.id;
    if (!songId) {
        res.status(400).json({
            message: "SongID is required",
        });
        return;
    }
    const user = await User.findById(userId);
    if (!user) {
        res.status(404).json({
            message: "NO user with this id",
        });
        return;
    }
    if (user.playlist.includes(songId)) {
        const index = user.playlist.indexOf(songId);
        user.playlist.splice(index, 1);
        await user.save();
        res.json({
            message: "Removed from playlist",
        });
        return;
    }
    user.playlist.push(songId);
    await user.save();
    res.json({
        message: "Added to PlayList",
    });
});
// NEW: Get user profile (for middleware in other services)
export const getMyProfile = TryCatch(async (req, res) => {
    const user = req.user;
    if (!user) {
        res.status(404).json({
            message: "User not found",
        });
        return;
    }
    res.json(sanitize(user));
});
// NEW: Add purchased song to user (called by Payment Service)
// (kept your original behavior: 400 if already purchased)
export const addPurchasedSong = TryCatch(async (_req, res) => {
    const { userId, songId } = _req.body;
    if (!userId || !songId) {
        res.status(400).json({
            message: "userId and songId are required",
        });
        return;
    }
    const user = await User.findById(userId);
    if (!user) {
        res.status(404).json({
            message: "User not found",
        });
        return;
    }
    // Check if already purchased
    if (user.purchasedSongs.includes(songId)) {
        res.status(400).json({
            message: "Song already purchased",
        });
        return;
    }
    user.purchasedSongs.push(songId);
    await user.save();
    res.json({
        message: "Song added to purchased list",
        purchasedSongs: user.purchasedSongs,
    });
});
// NEW: Check if user has purchased a song
export const checkPurchase = TryCatch(async (req, res) => {
    const userId = req.user?._id;
    const { songId } = req.params;
    if (!userId) {
        res.status(401).json({ message: "User not authenticated" });
        return;
    }
    if (!songId) {
        res.status(400).json({ message: "Song ID is required" });
        return;
    }
    const user = await User.findById(userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    const hasPurchased = user.purchasedSongs.includes(songId);
    res.json({
        hasPurchased,
        songId,
    });
});
// NEW: Get all purchased songs
export const getPurchasedSongs = TryCatch(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        res.status(401).json({
            message: "User not authenticated",
        });
        return;
    }
    const user = await User.findById(userId);
    if (!user) {
        res.status(404).json({
            message: "User not found",
        });
        return;
    }
    res.json({
        purchasedSongs: user.purchasedSongs,
    });
});
