import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routes/user.routes.js';
import stepRouter from './routes/StepRegistration.routes.js';
import connectDB from './DB/connectDB.js';
import {app} from './app.js'
import express from 'express'
import fundRouter from './routes/fund.routes.js';
import adminRouter from './routes/admin.routes.js'

dotenv.config({
    path: '.env' // Ensure this path is correct, often it's '.env'
});

const PORT = process.env.PORT || 3000;


// Routes
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/auth', userRouter);
app.use('/step', stepRouter);
app.use('/fund',fundRouter);
 app.use('/admin', adminRouter);

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
