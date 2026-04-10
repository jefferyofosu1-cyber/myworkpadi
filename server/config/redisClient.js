import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

if (!process.env.REDIS_URL) {
  console.warn('⚠️  REDIS_URL is missing from environment. Falling back to localhost.');
}

/**
 * Global Redis client instance.
 * Configuration:
 * - maxRetriesPerRequest: 3 (fails quickly if Redis is down)
 */
export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redis.on('error', (err) => {
  console.error('[Redis Error]', err);
});

redis.on('connect', () => {
  console.log('✅ Connected to Redis');
});
