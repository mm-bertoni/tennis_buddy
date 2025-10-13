import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createRateLimit } from './middleware/rateLimit.js';
import { errorHandler } from './middleware/errorHandler.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import courtsRouter from './routes/courts.js';
import reservationsRouter from './routes/reservations.js';
import buddiesRouter from './routes/buddies.js';
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js';

const app = express();

// __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Trust proxy - required for Vercel and rate limiting
app.set('trust proxy', 1);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for Vercel deployment
    crossOriginEmbedderPolicy: false,
  })
);

app.use(cors());

// Rate limiting
app.use(createRateLimit());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use(express.static('public'));

// API routes
app.use('/api/v1/courts', courtsRouter);
app.use('/api/v1/reservations', reservationsRouter);
app.use('/api/v1/buddies', buddiesRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/auth', authRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Catch-all for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Error handling
app.use(errorHandler());

export default app;
