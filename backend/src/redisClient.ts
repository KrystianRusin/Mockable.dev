import Redis from 'ioredis';

const redisClient = new Redis({
  host: 'localhost', // Replace with your Redis host
  port: 32768,        // Replace with your Redis port
  // password: 'your_redis_password', // Uncomment and set if needed
});

export default redisClient;