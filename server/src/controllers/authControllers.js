import User from "../models/user.models.js";
import oauth2Client from "../utils/googleConfig.js";
import axios from 'axios'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import OTP from "../models/OTP.model.js";

//for google login
export const googleLogin = async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.status(400).json({ message: 'No code provided' });
        }
        const googleRes = await oauth2Client.getToken(code);

        oauth2Client.setCredentials(googleRes.tokens);

        const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`)

        const { email, name, picture, id: googleId } = userRes.data;

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                username: name,
                email,
                image: picture,
                provider: 'google',
                googleId
            });
        }
        else if (user.provider !== 'google') {
            // Optional: Handle the case where the user previously signed up using local auth.
            return res.status(400).json({
                message: 'User already exists with local credentials. Please log in using your password.'
            });
        }
        // Generate JWT token
        const token = jwt.sign(
            { _id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_TIMEOUT }
        );
        return res.status(200).json({
            message: "Success",
            token,
            user
        })
    } catch (error) {
        console.error('Google login error:', error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

//for local registeration
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Validate that required fields are present
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Check if user already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            provider: 'local'
        });

        // Generate JWT token
        const token = jwt.sign(
            { _id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_TIMEOUT }
        );

        return res.status(201).json({
            message: 'User registered successfully.',
            token,
            user
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// local login
export const localLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }
  
      const user = await User.findOne({ email });
      if (!user || user.provider !== 'local') {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }
  
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }
  
      // Generate token
      const token = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_TIMEOUT }
      );
  
      return res.status(200).json({
        message: 'Login successful.',
        token,
        user
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };


export const getCurrentUser = async (req, res) => {
    return res
    .status(200)
    .json({
        message: "Current user fetched successfully",
        user: req.user
    });
 };
  
export default { googleLogin, registerUser, localLogin , getCurrentUser };