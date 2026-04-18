const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Function to connect to MongoDB Atlas
 */
const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB Atlas...");
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;