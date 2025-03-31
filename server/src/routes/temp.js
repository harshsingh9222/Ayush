import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

// Registration Route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the username or email is already taken
        let user = await User.findOne({ $or: [{ username }, { email }] });
        if (user) {
            return res.status(400).send('Username or Email already exists.');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        user = new User({
            username,
            email,
            password: hashedPassword
        });

        // Save the user to MongoDB
        await user.save();
        res.status(201).send('User registered successfully!'); // 201 status for successful creation
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

export default router;
