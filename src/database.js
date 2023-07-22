const { MongoClient } = require('mongodb');
require('dotenv').config(); // Load environment variables from .env file

const mongoURI = process.env.MONGO_URI;
let client;

async function connectDB() {
  try {
    client = await MongoClient.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  }
}

function getDB() {
  if (!client) {
    throw new Error('Database connection not established.');
  }
  return client.db("j4b-movies");
}

module.exports = {
  connectDB,
  getDB,
};
