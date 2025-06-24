import Admin from "../models/Admin.modal.js";
import Business from "../models/Business.model.js";
import Representative from "../models/Representative.model.js";
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
        
        const loggedInAdmin = await Admin.findById(admin._id).select("-adminPassword -refreshToken").populate({
            path: 'pendingBusinesses',
            populate: {
              path: 'representative',
              model: 'Representative'
            }
          });

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
  try {
    if (!req.admin) {
      return res.status(401).json({ message: "Unauthorized Admin" });
    }

    const fullAdmin = await Admin.findById(req.admin._id)
      .select("-adminPassword -refreshToken") // remove sensitive info
      .populate({
        path: 'pendingBusinesses',
        populate: {
          path: 'representative',
          model: 'Representative'
        }
      });

    return res.status(200).json({
      message: "Current Admin fetched successfully",
      admin: fullAdmin
    });
  } catch (error) {
    console.error("Error fetching current admin:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
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

// here i am writing the function for getting the pending business 

const getPendingBusinesses = asyncHandler(async (req, res) => {
    const adminId = req.admin._id;
    console.log("AdminId in fetching the pendingBusiness->",adminId);
    const admin = await Admin.findById(adminId).populate({
        path: 'pendingBusinesses',
        populate: {
          path: 'representative',
          model: 'Representative'
        }
      });
  
    if (!admin) {
      throw new ApiError(404, 'Admin not found');
    }
  
    return res.status(200).json(
      new ApiResponse(200, admin.pendingBusinesses, 'Pending businesses fetched successfully')
    );
  });

  // here i will write the logic of the BusinessVerifier Logic

  const verifyBusiness = asyncHandler(async (req, res) => {
    const businessId = req.params.businessId;
    const index = req.body.index;
    const status = req.body.status;
    console.log("Verifying Business->",businessId,index,status);
  
    // Find the business document from the database
    const business = await Business.findById(businessId);
    console.log("Verifying Business ->", business);
  
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }
  
    // Ensure the index is valid
    if (index < 0 || index >= business.statusDocs.length) {
      return res.status(400).json({ message: "Invalid document index" });
    }
  
    if (status === "approve") {
      business.statusDocs[index] = 1;
    } else if (status === "reject") {
      business.statusDocs[index] = 0;
    } else {
      return res.status(400).json({ message: "Invalid status" });
    }
  
    // Save the updated business document
    await business.save();
  
    // Return the updated business
    res.status(200).json(business);
  });
  
  const verifyRepresentative = asyncHandler(async (req, res) => {
    const repId = req.params.representativeId;
    const index = req.body.index;
    const status = req.body.status;
  
    // Find the representative by ID
    const representative = await Representative.findById(repId);
    if (!representative) {
      return res.status(404).json({ message: "Representative not found" });
    }
  
    // Ensure index is within bounds
    if (!Array.isArray(representative.statusDocs) || index < 0 || index >= representative.statusDocs.length) {
      return res.status(400).json({ message: "Invalid document index" });
    }
  
    // Update the status
    if (status === "approve") {
      representative.statusDocs[index] = 1;
    } else if (status === "reject") {
      representative.statusDocs[index] = 0;
    } else {
      return res.status(400).json({ message: "Invalid status value" });
    }
  
    // Save changes
    await representative.save();
  
    res.status(200).json(representative);
  });
  

// this is for the fetching the perticular business
  const perticularBusiness = asyncHandler(async(req,res) => {
        const business = await Business.findById(req.params.businessId);
        if (!business) return res.status(404).json({ message: "Business not found" });
        res.json({ data: business });
  });



export { adminLogin, getCurrentAdmin, adminLogout, getPendingBusinesses, perticularBusiness, verifyBusiness, verifyRepresentative};
