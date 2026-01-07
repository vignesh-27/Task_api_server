const { createClient } = require("redis");

function isRedisWorking() {
  // verify wheter there is an active connection
  return !!redisClient?.isOpen;
}
let redisClient = undefined;
module.exports = {
  initializeRedisClient: async () => {
    // read the Redis connection URL from the envs
    let redisURL = "redis://localhost:6379";
    if (redisURL) {
      // create the Redis client object
      redisClient = createClient({ url: redisURL }).on("error", (e) => {
        console.error(`Failed to create the Redis client with error:`);
        console.error(e);
      });

      try {
        // connect to the Redis server
        await redisClient.connect();
        console.log(`Connected to Redis successfully!`);
      } catch (e) {
        console.error(`Connection to Redis failed with error:`);
        console.error(e);
      }
    }
  },

  writeData: async (key, data, options) => {
    if (isRedisWorking()) {
      try {
        // write data to the Redis cache
        await redisClient.set(key, data, options);
      } catch (e) {
        console.error(`Failed to cache data for key=${key}`, e);
      }
    }
  },

  deleteData: async (key) => {
    if (isRedisWorking()) {
      try {
        // delete data to the Redis cache
        await redisClient.del(key);
      } catch (e) {
        console.error(`Failed to delete cache data =${key}`, e);
      }
    }
  },

  readData: async (key) => {
    let cachedValue = undefined;

    if (isRedisWorking()) {
      // try to get the cached response from redis
      cachedValue = await redisClient.get(key);
      if (cachedValue) {
        return cachedValue;
      } else {
        return [];
      }
    }
  },
};
