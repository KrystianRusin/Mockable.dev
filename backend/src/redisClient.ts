import Redis from 'ioredis';

const redisClient = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 32768,
  password: process.env.REDIS_PASSWORD || undefined,
});

export default redisClient;