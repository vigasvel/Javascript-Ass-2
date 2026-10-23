const mongoose = require('mongoose');

/**
 * Opens the MongoDB connection.
 * Uses MONGO_URI (local MongoDB / Atlas). If MongoDB is not running,
 * it falls back to an in-memory MongoDB so the project can still be demoed.
 */
module.exports = async function connect(dbName) {
  const uri = process.env.MONGO_URI || `mongodb://127.0.0.1:27017/${dbName}`;
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log(`✔ MongoDB: ${uri}`);
  } catch (e) {
    console.log(`✖ MongoDB not reachable at ${uri}`);
    console.log('  -> using in-memory MongoDB (records are cleared when the server stops)');
    const { MongoMemoryServer } = require('mongodb-memory-server-core');
    const memory = await MongoMemoryServer.create();
    await mongoose.connect(memory.getUri(dbName));
    console.log('✔ In-memory MongoDB ready');
  }
};
