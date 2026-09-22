const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (error) => {
  console.error("✗ Redis error:", error.message);
});

redisClient.on("connect", () => {
  console.log("→ Redis connecting...");
});

redisClient.on("ready", () => {
  console.log("✓ Redis ready");
});

const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    console.error("✗ Redis connection failed");
    console.error(`  ${error.message}`);

    process.exit(1);
  }
};

const disconnectRedis = async () => {
  try {
    if (redisClient.isOpen) {
      await redisClient.quit();
      console.log("✓ Redis disconnected");
    }
  } catch (error) {
    console.error("✗ Redis disconnect failed");
  }
};

module.exports = {
  redisClient,
  connectRedis,
  disconnectRedis,
};