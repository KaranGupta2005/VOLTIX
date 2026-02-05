import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL, {
  retryStrategy: (times) => Math.min(times * 50, 2000),
  tls: {} // required for rediss:// (Upstash secure connection)
});

redis.on("connect", () => {
  console.log("Upstash Redis connected successfully");
});

redis.on("ready", () => {
  console.log("Redis is ready to use");
});

redis.on("error", (err) => {
  console.error("Redis error:", err.message);
});

redis.on("close", () => {
  console.warn("Redis connection closed");
});

export default redis;
