import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

if (!process.env.REDIS_URL) {
  console.warn('[WARN] REDIS_URL is missing from environment. Falling back to localhost.');
}

/**
 * Global Redis client instance with Mock Fallback
 */
let redisInstance;

try {
  redisInstance = new Redis(redisUrl, {
    maxRetriesPerRequest: 1, // Fail fast for local testing
    retryStrategy(times) {
      if (times > 1) return null; // Don't keep retrying if it's not there
      return 50;
    }
  });

  redisInstance.on('error', (err) => {
    console.error('[Redis Error] Connection failed. Using in-memory mock fallback.');
    useMock();
  });

  redisInstance.on('connect', () => {
    console.log('[OK] Connected to Redis');
  });
} catch (e) {
  console.warn('[WARN] Could not initialize Redis client. Using in-memory mock.');
  useMock();
}

function useMock() {
  console.log('[MOCK] Initializing In-Memory Redis Mock for testing...');
  const store = new Map();
  redisInstance = {
    get: async (key) => store.get(key),
    set: async (key, val, mode, ttl) => store.set(key, val),
    del: async (key) => store.delete(key),
    on: () => {},
    isMock: true
  };
}

export const redis = redisInstance;
