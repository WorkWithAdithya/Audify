import axios from "axios";
import { NextFunction, Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.token as string;
    console.log("🔐 Payment Service - Checking auth...");
    console.log("Token received:", token ? "✅ Yes" : "❌ No");

    if (!token) {
      console.log("❌ No token provided");
      res.status(403).json({ message: "Please Login" });
      return;
    }

    const userServiceUrl = process.env.USER_SERVICE_URL || "http://localhost:5000";
    console.log("🌐 Calling User Service:", `${userServiceUrl}/api/v1/user/me`);
    
    const { data } = await axios.get(`${userServiceUrl}/api/v1/user/me`, {
      headers: { token },
    });

    console.log("✅ User authenticated:", data.email);
    req.user = data;
    
    // CRITICAL - Must call next() to pass control to controller
    next();
  } catch (error: any) {
    console.error("❌ Auth error:", error.message);
    res.status(403).json({ message: "Authentication failed" });
  }
};
