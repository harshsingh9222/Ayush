import express from 'express';
import { googleLogin,registerUser,localLogin } from '../controllers/authControllers.js';

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

export default router;
