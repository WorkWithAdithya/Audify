import axios from "axios";
export const isAuth = async (req, res, next) => {
    try {
        const token = req.headers.token;
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
    }
    catch (error) {
        console.error("❌ Auth error:", error.message);
        res.status(403).json({ message: "Authentication failed" });
    }
};
