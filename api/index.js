import 'dotenv/config';
import app from '../src/app.js';
import { connect } from '../src/db/client.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'tennis_buddy';

// Initialize database connection
let dbConnection = null;

async function initDB() {
  if (!dbConnection) {
    try {
      dbConnection = await connect(MONGO_URI, DB_NAME);
      console.log(`✅ Connected to MongoDB: ${dbConnection.databaseName}`);
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      throw error;
    }
  }
  return dbConnection;
}

// Vercel serverless function handler
export default async function handler(req, res) {
  try {
    // Ensure database connection
    await initDB();
    
    // Pass request to Express app
    return app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
}

