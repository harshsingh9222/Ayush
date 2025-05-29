import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './routes/authRouter.js';
import stepRouter from './routes/StepRegistration.routes.js';
import connectDB from './DB/connectDB.js';
import {app} from './app.js'

dotenv.config({
    path: '.env' // Ensure this path is correct, often it's '.env'
});

const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true, 
}));

app.use(express.json());

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
