import rateLimit from "express-rate-limit";

const isDevelopment = process.env.NODE_ENV !== "production";

const rateLimiter = rateLimit({
  windowMs: isDevelopment ? 1 * 60 * 1000 : 15 * 60 * 1000, // 1 minute in dev, 15 minutes in prod
  max: isDevelopment ? 3000 : 1000, // Higher limit in development
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: "Too many requests from this IP, please try again later.",
  },
});

export default rateLimiter;