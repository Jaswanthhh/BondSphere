const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');
const config = require('../config/redis');

const redis = new Redis(config.redisUrl);

// General API rate limiter
const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:api:'
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Auth routes rate limiter (more strict)
const authLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:auth:'
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Message sending rate limiter
const messageLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:message:'
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 requests per windowMs
  message: 'Too many messages sent, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Post creation rate limiter
const postLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:post:'
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per windowMs
  message: 'Too many posts created, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Comment creation rate limiter
const commentLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:comment:'
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 requests per windowMs
  message: 'Too many comments created, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  apiLimiter,
  authLimiter,
  messageLimiter,
  postLimiter,
  commentLimiter
}; 