const redis = require('redis');

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    connectTimeout: 5000,
    reconnectStrategy: (retries) => {
      if (retries > 3) return false;
      return Math.min(retries * 100, 3000);
    }
  }
});

client.on('connect', () => console.log('Connected to Redis at', process.env.REDIS_HOST));
client.on('error', (err) => console.error('Redis error:', err.message));

client.connect().catch(err => console.warn('Redis initial connection failed:', err.message));

module.exports = client;
