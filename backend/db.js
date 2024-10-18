// db.js - MongoDB Connection Logic
const { MongoClient } = require('mongodb');

// MongoDB URI and database details
const uri = 'mongodb://0.0.0.0:27017'; // Replace with your MongoDB URI if needed
const dbName = 'mini_project';           // Replace with your database name
let db;                                  // Declare db variable for global use

// MongoDB connection function
async function connectToDatabase() {
  try {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log('Connected to the MongoDB server.');
    db = client.db(dbName); // Set the db variable for global use
    return db; // Return the database instance
  } catch (error) {
    console.error('An error occurred while connecting to MongoDB:', error);
    throw error;
  }
}

// Export the connection function
module.exports = { connectToDatabase };
