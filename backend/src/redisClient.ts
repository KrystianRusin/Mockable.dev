import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = new Redis({
  host: process.env.REDIS_HOST || process.env.LOCAL_REDIS_HOST,
  port: Number(process.env.REDIS_PORT) || Number(process.env.LOCAL_REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});

export default redisClient;