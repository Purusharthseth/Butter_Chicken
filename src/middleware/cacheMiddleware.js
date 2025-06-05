import cache from '../utils/cache.js';

function generateCacheKey(req) {
  const params = req.query;
  const sortedParams = Object.keys(params).sort().map((key) => `${key}=${params[key]}`).join('&');
  return sortedParams ? `Chapters: ${sortedParams}` : "Chapters";
}
 
const cacheMiddleware = async (req, res, next) => {
  const cacheKey = generateCacheKey(req);

  try {
    const cachedData = await cache.get(cacheKey);

    if (cachedData) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return res.status(200).json(cachedData);
    }

    req.cacheKey = cacheKey;
    next();
  } catch (error) {
    console.error('Cache middleware error:', error);
    next();
  }
};

export default cacheMiddleware;
