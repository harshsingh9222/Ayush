import jwt from 'jsonwebtoken';
import User  from "../models/user.models.js";
import { ApiError } from '../utils/ApiError.js';

export const verifyJWT = async (req, _, next) => {
 
    const token = req.cookies?.access_token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        console.log(token);
        throw new ApiError(405, "Authentication token missing");
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decodedToken._id).select("-password ");
        console.log("user is in auth middleware: ", user);
        if (!user) {
            throw new ApiError(403, "User not found or invalid token");
        }

        req.user = user;

        next(); 
    } 
    catch (error) {
        console.error("Error while verifying token:", error.message);

        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, error.name);
        }

        throw new ApiError(402, "Invalid authentication token");
    }
};