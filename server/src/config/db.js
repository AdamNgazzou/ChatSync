require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI; // Use environment variable for the connection string

async function connectDB() {
  try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect(uri); 
    console.log("Successfully connected to MongoDB with Mongoose!");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); // Exit the process if the connection fails
  }
}

module.exports = { connectDB };