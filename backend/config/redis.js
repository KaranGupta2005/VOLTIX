import Redis from "ioredis";

const redisConfig = {
  tls: {},
  lazyConnect: false,
  maxRetriesPerRequest: 3,
  enableOfflineQueue: true, // Allow queuing commands while connecting
  retryStrategy(times) {
    const maxRetries = 10;
    if (times > maxRetries) {
      console.error("❌ Redis max retries reached. Stopping reconnection attempts.");
      return null; // Stop retrying
    }
    const delay = Math.min(times * 200, 2000);
    console.log(`⏳ Redis retry attempt ${times}/${maxRetries} in ${delay}ms`);
    return delay;
  },
  reconnectOnError(err) {
    const targetErrors = ['READONLY', 'ECONNRESET'];
    if (targetErrors.some(e => err.message.includes(e))) {
      return true; // Reconnect on these errors
    }
    return false;
  }
};

const redis = new Redis(process.env.REDIS_URL, redisConfig);

let isConnected = false;
let hasLoggedError = false;

redis.on("connect", () => {
  console.log("✅ Redis connected (Upstash)");
  isConnected = true;
  hasLoggedError = false;
});

redis.on("ready", () => {
  console.log("🚀 Redis ready");
  isConnected = true;
  hasLoggedError = false;
});

redis.on("error", (err) => {
  isConnected = false;
  // Only log the first error to avoid spam
  if (!hasLoggedError) {
    console.error("❌ Redis error:", err.message);
    hasLoggedError = true;
  }
});

redis.on("close", () => {
  isConnected = false;
  if (!hasLoggedError) {
    console.log("⚠️ Redis connection closed");
  }
});

redis.on("end", () => {
  isConnected = false;
  if (!hasLoggedError) {
    console.log("⚠️ Redis connection ended");
  }
});

// Helper function to check if Redis is available
export const isRedisAvailable = () => isConnected;

// Graceful wrapper for Redis operations
export const safeRedisOperation = async (operation, fallback = null) => {
  if (!isConnected) {
    console.warn("⚠️ Redis not available, using fallback");
    return fallback;
  }
  try {
    return await operation();
  } catch (error) {
    console.error("❌ Redis operation failed:", error.message);
    return fallback;
  }
};

// Create a duplicate with proper error handling
export const createRedisDuplicate = () => {
  const duplicate = redis.duplicate();
  
  let duplicateHasLoggedError = false;
  
  duplicate.on("error", (err) => {
    // Only log the first error to avoid spam
    if (!duplicateHasLoggedError) {
      console.error("❌ Redis duplicate error:", err.message);
      duplicateHasLoggedError = true;
    }
  });
  
  duplicate.on("connect", () => {
    duplicateHasLoggedError = false;
  });
  
  return duplicate;
};

export default redis;
