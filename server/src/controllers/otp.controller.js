import Business from "../models/Business.model.js";
import OTP from "../models/OTP.model.js";
import Representative from "../models/Representative.model.js";
import User from "../models/user.models.js";
import otpGenerator from "otp-generator";

export const sendotp = async (req, res) => {
  try {
    const { email, type } = req.body;

    console.log(email);
    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone is required'
      });
    }


    // Generate OTP
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    
    // Check for existing OTP
    let result = await OTP.findOne({ otp });
    while (result) {
      otp = otpGenerator.generate(6, { upperCaseAlphabets: false });
      result = await OTP.findOne({ otp });
    }

    // Create OTP payload with contact info
    const otpPayload = { otp , email };

    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    res.status(200).json({
      success: true,
      message: 'OTP Sent Successfully',
      otp,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const verifyotp = async(req, res) =>{
    const userId = req.user._id;

    const {email, type, otp, mobileNo, registrationNumber} = req.body;
    console.log("Verifying otp... ",email, otp, type, mobileNo);
    try {

        if(type === "representativeMobile" ){
            await Representative.findOneAndUpdate({ userId }, { mobileNo: mobileNo });
            return res.status(200).json({
                success: true,
                message: 'The OTP is valid',
            })
        }
        if(type === "businessMobile"){
            await Business.findOneAndUpdate({ registrationNumber }, { mobileNo: mobileNo });
            return res.status(200).json({
                success: true,
                message: 'The OTP is valid',
            })
        }

        const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        
        console.log("Response in otp:", response);
        if (response.length === 0 || otp !== response[0].otp) {
            return res.status(400).json({
                success: false,
                message: 'The OTP is not valid',
            });
        }

        if(type === "representativeEmail"){
            await Representative.findOneAndUpdate({ userId }, { email: email });
        }
        else{
            await Business.findOneAndUpdate({ registrationNumber }, { email: email });
        }

        return res.status(200).json({
          success: true,
          message: 'The OTP is valid',  
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}