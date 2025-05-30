import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true, 
}));

app.use(express.json());
app.use(cookieParser());


app.use(express.urlencoded({
    limit:'16mb',
    extended:true
}))
app.use(express.static('public'))


export {app}