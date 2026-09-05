const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
dns.setDefaultResultOrder('ipv4first');

const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  let connected = false;

  if (uri) {
    try {
      console.log('Connecting to MongoDB...');
      const timeout = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('Atlas connection timed out (check IP whitelist / SSL alert 80)')),
          3000
        )
      );

      const conn = await Promise.race([
        mongoose.connect(uri, { serverSelectionTimeoutMS: 2500, family: 4 }),
        timeout,
      ]);
      console.log(`MongoDB connected to external cluster: ${conn.connection.host}`);
      connected = true;
    } catch (err) {
      console.warn(`External MongoDB connection failed (${err.message}).`);
      console.warn('Falling back to local in-memory MongoDB so the app runs smoothly without interruption...');
    }
  }

  if (!connected) {
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create({
        instance: { dbName: 'job-portal' },
      });
      const memoryUri = mongodInstance.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`Local in-memory MongoDB connected: ${conn.connection.host}`);

      // Auto-seed if database is empty
      const User = require('../models/User');
      const count = await User.countDocuments();
      if (count === 0) {
        console.log('Auto-seeding local database with test accounts & sample listings...');
        const seedData = require('../seed/seed');
        await seedData();
      }
    } catch (fallbackErr) {
      console.error(`Failed to initialize local MongoDB: ${fallbackErr.message}`);
      process.exit(1);
    }
  }
};

process.on('SIGINT', async () => {
  if (mongodInstance) await mongodInstance.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  if (mongodInstance) await mongodInstance.stop();
  process.exit(0);
});

module.exports = connectDB;
