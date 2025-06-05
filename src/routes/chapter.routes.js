import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import { upload } from "../middleware/uploadFile.js";
import getAllChapters from "../controllers/getAllChapters.controller.js";
import getChapterById from "../controllers/getChapterbyId.controller.js";
import uploadChapters from "../controllers/uploadChapter.controller.js";
import redisClient from "../utils/redisClient.js";
import cacheMiddleware from "../middleware/cacheMiddleware.js";
import { rateLimit } from 'express-rate-limit';
import cache from "../utils/cache.js";
const router = express.Router();

class RateLimitStore {
  constructor(options) {
    this.sendCommand = options.sendCommand;
  }

  async increment(key) {
    try {
     
      await this.sendCommand('MULTI');
      
      await this.sendCommand('INCR', key);
      await this.sendCommand('EXPIRE', key, '60'); 
      
     
      const results = await this.sendCommand('EXEC');
      
     
      const totalHits = results[0];
      
      return { 
        totalHits: totalHits,
        resetTime: new Date(Date.now() + 60000)
      };
    } catch (error) {
      console.error('Rate limit increment error:', error);
    
      return { 
        totalHits: 1, 
        resetTime: new Date(Date.now() + 60000) 
      };
    }
  }

  async decrement(key) {
    try {
      await this.sendCommand('DECR', key);
    } catch (error) {
      console.error('Rate limit decrement error:', error);
    }
  }

  async resetKey(key) {
    try {
      await this.sendCommand('DEL', key);
    } catch (error) {
      console.error('Rate limit reset error:', error);
    }
  }
}
const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 30,
  standardHeaders: true, 
  legacyHeaders: false,
  store: new RateLimitStore({ 
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
});
router.use(limiter);


router.get("/", cacheMiddleware, async (req, res, next) => {
  try {

    const originalJson = res.json.bind(res);
    
    
    res.json = (data) => {

      if (req.cacheKey && data) {
        cache.set(req.cacheKey, data)
          .catch(err => console.error('Cache set error:', err));
      }
      originalJson(data);
    };
    
    await getAllChapters(req, res, next);
  } catch (error) {
    next(error);
  }
});


router.get("/:id", getChapterById);    
router.post("/", (req, res, next) => {
  req.user = { isAdmin: true }; 
  next();
}, adminAuth, upload.single("file"), async (req, res, next) => {
  try {
    const result = await uploadChapters(req, res);
   
    const keys = await redisClient.keys('chapters:*');
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;