import jwt,{decode} from 'jsonwebtoken';
import User from "../models/user.models.js";
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        console.log("No token found");
        return res.status(401).json({
            success: false,
            message: "Authentication token missing"
        });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        console.log("User in auth middleware:", user);

        if (!user) {
            throw new ApiError(401, " User not found or Invalid Access Token");
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
            message: "Invalid Access token"
        });
    }
});
