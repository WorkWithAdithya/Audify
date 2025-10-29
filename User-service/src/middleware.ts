import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser, User } from "./model.js";

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

// Helper function to get JWT secret
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SEC || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SEC/JWT_SECRET environment variable is not defined");
  }
  return secret;
};

// Support both "Authorization: Bearer <token>" and legacy "headers.token"
const getToken = (req: Request): string | null => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer ")) return auth.slice(7).trim();
  const legacy = req.headers.token as string | undefined;
  return legacy || null;
};

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = getToken(req);

    if (!token) {
      res.status(403).json({
        message: "Please Login",
      });
      return;
    }

    const decodedValue = jwt.verify(token, getJwtSecret()) as JwtPayload;

    // Support both `_id` and standard `sub`
    const userId = (decodedValue && (decodedValue._id as string)) || (decodedValue?.sub as string);

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
  } catch (error) {
    res.status(403).json({
      message: "Please Login",
    });
  }
};