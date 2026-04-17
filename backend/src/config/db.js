const mongoose = require('mongoose');
const dns = require('dns');

const applyMongoDnsFallback = () => {
  const rawServers = process.env.MONGODB_DNS_SERVERS || '8.8.8.8,1.1.1.1';
  const servers = rawServers
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean);

  if (!servers.length) return;

  dns.setServers(servers);
  console.log(`MongoDB DNS fallback active: ${servers.join(', ')}`);
};

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is missing in .env');
  }

  try {
    // Atlas SRV lookups can fail on some local DNS setups; use reliable resolvers.
    if (mongoUri.startsWith('mongodb+srv://')) {
      applyMongoDnsFallback();
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
