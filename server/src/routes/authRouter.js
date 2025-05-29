import express from 'express';
import { googleLogin,registerUser,localLogin, getCurrentUser } from '../controllers/authControllers.js';
import {stepRegistration} from '../controllers/StepRegistration.controller.js';
import { upload } from '../Middlewares/multer.middleware.js';
import { verifyJWT } from '../Middlewares/auth.middleware.js';
import { sendotp, verifyotp } from '../controllers/otp.controller.js';

const router = express.Router();

// Define your routes here
router.get('/test', (req, res) => {
    res.send('Hello from authRouter!');
});

// Google login route (expects a query parameter: code)
router.get('/google', googleLogin);

// Local registration route
router.post('/register', registerUser);

// Local login route
router.post('/login', localLogin);

router.post('/send-otp', verifyJWT, sendotp)
router.post('/verify-otp', verifyJWT, verifyotp)
router.get('/current-user', verifyJWT, getCurrentUser);
export default router;
