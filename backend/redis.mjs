import dotenv from 'dotenv';
import Redis from 'ioredis';

dotenv.config();

// env
const redisHost = process.env.REDIS_HOST;
const redisPort = Number(process.env.REDIS_PORT);
const redisUsername = process.env.REDIS_USERNAME;
const redisPassword = process.env.REDIS_PASSWORD;

// Redis connection
const redisClient = new Redis({
  host: redisHost,
  port: redisPort,
  tls: true,
  username: redisUsername,
  password: redisPassword,
  // commandTimeout: 5000,
});

// Redis listeners
redisClient.on('connect', () => {
  console.error(`${new Date(Date.now()).toISOString()}: Connected to Redis`);
});

redisClient.on('end', () => {
  console.error(`${new Date(Date.now()).toISOString()}: Disconnected from Redis`);
});

redisClient.on('error', error => {
  console.error(`${new Date(Date.now()).toISOString()}: Redis connection error: ${error}`);
});

export default redisClient;
