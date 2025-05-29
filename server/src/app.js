import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRouter.js';


const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true, 
}));

app.use(express.json());

app.use(express.urlencoded({
    limit:'16mb',
    extended:true
}))
app.use(express.static('public'))

// Routes
app.use('/auth', authRouter);

export {app}