import rateLimit from 'express-rate-limit';

export function createRateLimit() {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs (more generous for dev)
    message: {
      error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for static assets
      return req.path.startsWith('/css/') || 
             req.path.startsWith('/js/') || 
             req.path.startsWith('/img/') ||
             req.path === '/favicon.ico';
    }
  });
}

export function createAuthRateLimit() {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
      error: 'Too many authentication attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
}
