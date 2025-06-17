// utils/token.js
import Admin from "../models/Admin.modal.js";
import User from "../models/user.models.js";
import { ApiError } from "./ApiError.js";

export const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        // Generate access token
        const accessToken = user.generateAccessTokenAdmin();
        // Generate refresh token
        const refreshToken = user.generateRefreshTokenAdmin();
        // Save refresh token in user document
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        console.error('Error generating tokens:', error);
        throw new ApiError(500, 'Internal Server Error');
    }
};


// here i am generating refresh and access token for the admin

const generateAccessAndRefreshTokenAdmin = async (adminId) => {
    try {
        const admin = await Admin.findById(adminId);
        if (!admin) {
            throw new ApiError(404, "Admin not found");
        }
        // Generate access token
        const accessToken = admin.generateAccessTokenAdmin();
        // Generate refresh token
        const refreshToken = admin.generateRefreshTokenAdmin();
        // Save refresh token in user document
        admin.refreshToken = refreshToken;
        await admin.save({ validateBeforeSave: false });
        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        console.error('Error generating tokens for Admin: ', error);
        throw new ApiError(500, 'Internal Server Error for admin');
    }
};

export {generateAccessAndRefreshTokenAdmin};