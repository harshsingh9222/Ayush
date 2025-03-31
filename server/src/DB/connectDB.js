import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const DB_URL=process.env.DB_URL

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${DB_URL}/${DB_NAME}`);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to DB : ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;