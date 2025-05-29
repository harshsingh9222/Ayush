import dotenv from 'dotenv';
import connectDB from './DB/connectDB.js';
import {app} from './app.js'

dotenv.config({
    path: '.env' // Ensure this path is correct, often it's '.env'
});

const PORT = process.env.PORT || 8080;


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
