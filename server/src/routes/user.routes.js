import express from 'express';
import {
  googleLogin,
  registerUser,
  localLogin,
  getCurrentUser,
  logoutUser,
  refreshAccessToken,
} from '../controllers/user.Controllers.js';
import { stepRegistration } from '../controllers/StepRegistration.controller.js';
import { upload } from '../Middlewares/multer.middleware.js';
import {upload_cloud} from "../Middlewares/cloudinary_multer.middleware.js"
import { verifyJWT } from '../Middlewares/auth.middleware.js';
import { sendotp, verifyotp } from '../controllers/otp.controller.js';

const router = express.Router();

// Simple test route
router.route('/test').get((req, res) => {
  res.send('Hello from userRouter!');
});

// Google login
router.route('/google/callback').post(googleLogin);

// Registration and login
router.route('/register').post(registerUser);
router.route('/login').post(localLogin);

// Logout
router.route('/logout').post(verifyJWT,logoutUser)

//RefreshAccessToken
router.route('/refreshaccesstoken').post(verifyJWT,refreshAccessToken)


// OTP
router.route('/send-otp').post(verifyJWT, sendotp);
router.route('/verify-otp').post(verifyJWT, verifyotp);

// Current user
router.route('/current-user').get(verifyJWT, getCurrentUser);

export default router;
