require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_URI; // Use environment variable for the connection string
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let dbConnection;

async function connectDB() {
  try {
    if (!dbConnection) {
      // Connect the client to the server
      await client.connect();
      dbConnection = client.db(); // Default    database
      console.log("Successfully connected to MongoDB!");
    }
    return dbConnection;
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); // Exit the process if the connection fails
  }
}

module.exports = { connectDB };