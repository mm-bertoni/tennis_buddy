import { MongoClient } from 'mongodb';

let client;
let db;

async function connect(uri, dbName) {
  if (!client) {
    client = new MongoClient(uri, { maxPoolSize: 10 });
    await client.connect();
    db = client.db(dbName);
    console.log(`Connected to MongoDB database: ${dbName}`);
  }
  return db;
}

function getDb() {
  if (!db) throw new Error('DB not initialized. Call connect() first.');
  return db;
}

async function close() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

export { connect, getDb, close };
