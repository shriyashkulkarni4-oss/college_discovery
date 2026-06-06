import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { errorMiddleware } from './middleware/error.middleware';

// Routes
import authRoutes from './modules/auth/auth.route';
import collegeRoutes from './modules/college/college.route';
import courseRoutes from './modules/course/course.route';
import reviewRoutes from './modules/review/review.route';
import savedRoutes from './modules/saved/saved.route';
import compareRoutes from './modules/compare/compare.route';
import adminRoutes from './modules/admin/admin.route';

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use(limiter);

// Auth-specific rate limit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts, please try again later' },
});

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'College Discovery API is running', env: env.NODE_ENV });
});

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler (must be last)
app.use(errorMiddleware);

const PORT = parseInt(env.PORT, 10);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${env.NODE_ENV}`);
});

export default app;
