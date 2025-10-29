import jwt from "jsonwebtoken";
import { User } from "./model.js";
// Helper function to get JWT secret
const getJwtSecret = () => {
    const secret = process.env.JWT_SEC || process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SEC/JWT_SECRET environment variable is not defined");
    }
    return secret;
};
// Support both "Authorization: Bearer <token>" and legacy "headers.token"
const getToken = (req) => {
    const auth = req.headers.authorization;
    if (auth && auth.startsWith("Bearer "))
        return auth.slice(7).trim();
    const legacy = req.headers.token;
    return legacy || null;
};
export const isAuth = async (req, res, next) => {
    try {
        const token = getToken(req);
        if (!token) {
            res.status(403).json({
                message: "Please Login",
            });
            return;
        }
        const decodedValue = jwt.verify(token, getJwtSecret());
        // Support both `_id` and standard `sub`
        const userId = (decodedValue && decodedValue._id) || decodedValue?.sub;
        if (!decodedValue || !userId) {
            res.status(403).json({
                message: "Invalid token",
            });
            return;
        }
        const user = await User.findById(userId).select("-password");
        if (!user) {
            res.status(403).json({
                message: "User Not found",
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(403).json({
            message: "Please Login",
        });
    }
};
