import Admin from "../models/Admin.modal.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateAccessAndRefreshTokenAdmin } from "../utils/tokens.js";
const options = {
    httpOnly: true,
    secure: true,
    // sameSite: "strict"
};

const adminLogin = asyncHandler(async (req, res) => {
    try {
        const { adminName, adminPassword } = req.body;

        console.log("AdminName->",adminName);
        console.log("AdminadminPassword->",adminPassword);

        if (!adminName || !adminPassword) {
            return res.status(400).json({ message: 'AdminName or adminPassword not found' });
        }

        const admin = await Admin.findOne({ adminName }); 

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const isMatch = await admin.isPasswordCorrect(adminPassword);
        if (!isMatch) {
            return res.status(402).json({ message: "adminPassword is incorrect" });
        }
        
        console.log("Admin Id at login->",admin._id);
        // i have to remove it from here and do something
      
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokenAdmin(admin._id);

        console.log("AccessToken for Admin->",accessToken);
        console.log("RefreshToken for Admin->",refreshToken);
        
        const loggedInAdmin = await Admin.findById(admin._id).select("-adminPassword -refreshToken");
        console.log("LoggedInAdmin->",loggedInAdmin);
        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                message: 'Login successful.',
                accessToken,
                refreshToken,
                admin: loggedInAdmin
            });

    } catch (error) {
        console.log("Admin Internal Server Error in login ->", error);
        return res.status(500).json({ message: "Admin Internal server error" });
    }
});

// here i am writing the function for finding the current loggedIn admin

const getCurrentAdmin = async (req, res) => {
    if (!req.admin) {
        return res.status(401).json({ message: "Unauthorized Admin" });
    }
    return res
        .status(200)
        .json({
            message: "Current Admin fetched successfully",
            admin: req.admin
        });
};


const adminLogout = asyncHandler(async (req, res) => {
    const admin = await Admin.findByIdAndUpdate(
        req.admin._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        { new: true }
    );

    console.log('Admin after logout:', admin);
    if (!admin) {
        throw new ApiError(404, 'Admin not found');
    }
    
    return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(new ApiResponse(200, {}, 'Admin Logout Successful'));
});


export { adminLogin, getCurrentAdmin, adminLogout };
