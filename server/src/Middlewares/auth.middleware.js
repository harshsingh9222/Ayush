import jwt from 'jsonwebtoken';
import User from "../models/user.models.js";
import { ApiError } from '../utils/ApiError.js';

export const verifyJWT = async (req, res, next) => {
    const token = req.cookies?.access_token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        console.log("No token found");
        return res.status(401).json({
            success: false,
            message: "Authentication token missing"
        });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decodedToken._id).select("-password");
        console.log("User in auth middleware:", user);

        if (!user) {
            return res.status(403).json({
                success: false,
                message: "User not found or invalid token"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error while verifying token:", error.message);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired"
            });
        }

        return res.status(402).json({
            success: false,
            message: "Invalid authentication token"
        });
    }
};
