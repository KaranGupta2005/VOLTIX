import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL, {
  tls: {},
  lazyConnect: false,
  maxRetriesPerRequest: 3,
  enableOfflineQueue: false,
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
    console.error("❌ Redis reconnect on error:", err.message);
    return false; // Don't reconnect on error
  }
});

let isConnected = false;

redis.on("connect", () => {
  console.log("✅ Redis connected (Upstash)");
  isConnected = true;
});

redis.on("ready", () => {
  console.log("🚀 Redis ready");
  isConnected = true;
});

redis.on("error", (err) => {
  isConnected = false;
  // Only log unique errors, not repeated connection failures
  if (!err.message.includes("ECONNREFUSED")) {
    console.error("❌ Redis error:", err.message);
  }
});

redis.on("close", () => {
  isConnected = false;
  console.log("⚠️ Redis connection closed");
});

redis.on("end", () => {
  isConnected = false;
  console.log("⚠️ Redis connection ended");
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

export default redis;
