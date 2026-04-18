const mongoose = require('mongoose');
const dns = require('dns');
const os = require('os');

const LOOPBACK_REGEX = /^(127(\.\d{1,3}){3}|::1|0:0:0:0:0:0:0:1)$/i;
const COMMON_LAN_DNS = ['192.168.1.1', '192.168.0.1', '10.0.0.1'];

const normalizeServer = (server) => server.replace(/^\[|\]$/g, '').split('%')[0];
const isLoopbackServer = (server) => LOOPBACK_REGEX.test(normalizeServer(server));

const parseServerList = (value = '') =>
  value
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean);

const getLanDnsCandidates = () => {
  const candidates = new Set(COMMON_LAN_DNS);
  const interfaces = os.networkInterfaces();

  for (const entries of Object.values(interfaces)) {
    if (!Array.isArray(entries)) continue;

    for (const details of entries) {
      if (!details || details.internal || details.family !== 'IPv4') continue;
      const octets = details.address.split('.');
      if (octets.length === 4) {
        candidates.add(`${octets[0]}.${octets[1]}.${octets[2]}.1`);
      }
    }
  }

  return Array.from(candidates);
};

const resolveSrvWithTimeout = async (record, timeoutMs = 4000) => {
  await Promise.race([
    dns.promises.resolveSrv(record),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`DNS timeout after ${timeoutMs}ms`)), timeoutMs);
    }),
  ]);
};

const ensureMongoSrvResolver = async (mongoUri) => {
  if (!mongoUri.startsWith('mongodb+srv://')) return;

  const hostname = new URL(mongoUri).hostname;
  const srvRecord = `_mongodb._tcp.${hostname}`;
  const rawServers = process.env.MONGODB_DNS_SERVERS;
  const envServers = parseServerList(rawServers);
  const systemServers = dns.getServers().filter((server) => !isLoopbackServer(server));

  const candidates = envServers.length
    ? envServers
    : systemServers.length
      ? systemServers
      : getLanDnsCandidates();

  if (!candidates.length) return;

  let lastError = null;

  for (const server of candidates) {
    try {
      dns.setServers([server]);
      await resolveSrvWithTimeout(srvRecord);
      console.log(`MongoDB DNS resolver in use: ${server}`);
      return;
    } catch (error) {
      lastError = error;
    }
  }

  const detail = lastError ? ` Last error: ${lastError.message}` : '';
  throw new Error(
    `Unable to resolve MongoDB SRV record using configured DNS servers.${detail} Set MONGODB_DNS_SERVERS in .env (for example: 192.168.1.1).`
  );
};


const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is missing in .env');
  }

  try {
    await ensureMongoSrvResolver(mongoUri);

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
