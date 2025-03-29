import express from 'express';

const router = express.Router();

// Login route
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Add your authentication logic here
    if (username === 'admin' && password === 'password') {
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Logout route
router.post('/logout', (_, res) => {
    // Add your logout logic here
    res.status(200).json({ message: 'Logout successful' });
});

export default router;