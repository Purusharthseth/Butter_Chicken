import redisClient from './redisClient.js';

const cache = {
  
  get: async (key) => {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  set: async (key, data, ttl = 3600) => {
    try {
      if (!data) {
        throw new Error('Cannot cache undefined or null data');
      }
      const stringData = JSON.stringify(data);
      await redisClient.set(key, stringData, { EX: ttl });
    } catch (error) {
      console.error('Cache set error:', error);
    }
  },

  
  invalidate: async (key) => {
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
  }
};

export default cache;