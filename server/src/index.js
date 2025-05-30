import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './routes/authRouter.js';
import stepRouter from './routes/StepRegistration.routes.js';
import connectDB from './DB/connectDB.js';
import {app} from './app.js'
import express from 'express'

dotenv.config({
    path: '.env' // Ensure this path is correct, often it's '.env'
});

const PORT = process.env.PORT || 3000;


// Routes
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/auth', authRouter);
app.use('/step', stepRouter);

// Connect to DB and start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to DB", err.message);
    process.exit(1);
  });
