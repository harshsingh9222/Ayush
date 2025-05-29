import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRouter.js';


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    limit:'16mb',
    extended:true
}))
app.use(express.static('public'))

// Routes
app.use('/auth', authRouter);

export {app}