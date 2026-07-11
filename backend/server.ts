import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import db, { initializeDatabase } from './database';
import leadsRoutes from './routes/leads';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';

const app = express();
const PORT = process.env.PORT || 3001;

// FRONTEND_URL can be a comma-separated list of allowed origins.
// e.g. "https://sellerrocket-venkateswaran.vercel.app,http://localhost:5173"
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

console.log('✓ Allowed CORS origins:', allowedOrigins);

let server: any;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Leads API is running',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      leads: {
        list: 'GET /api/leads',
        create: 'POST /api/leads',
        get: 'GET /api/leads/:id',
        updateStatus: 'PATCH /api/leads/:id/status',
        delete: 'DELETE /api/leads/:id',
      },
    },
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/leads', leadsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
  });
});

// Initialize database and start server
(async () => {
  try {
    await initializeDatabase();
    console.log('✓ Database initialized');

    server = app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ CORS enabled for: ${allowedOrigins.join(', ')}`);
    });

    server.on('error', (err: any) => {
      if (err && err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the other process or set a different PORT.`);
        process.exit(1);
      } else {
        console.error('Unhandled server error:', err);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n✓ Shutting down gracefully...');
  if (server && typeof server.close === 'function') {
    server.close(() => {
      db.close();
      process.exit(0);
    });
  } else {
    db.close();
    process.exit(0);
  }
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  process.exit(1);
});
