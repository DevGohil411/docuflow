require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieSession = require('cookie-session');
const passport = require('./config/passport');
const { initializeFirebase } = require('./config/firebase');

// Import routes
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');

const app = express();

// Initialize Firebase
initializeFirebase();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
// Use SameSite=None to allow cross-site requests from the frontend (e.g., http://localhost:3000)
// In production, cookies are Secure; in development on localhost, Secure is disabled.
app.use(cookieSession({
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  keys: [process.env.SESSION_SECRET],
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'none',
}));

// Make cookie-session compatible with Passport (expects regenerate/save)
app.use((req, res, next) => {
  // Ensure session object exists (cookie-session can leave it undefined until used)
  if (!req.session) {
    req.session = {};
  }
  if (typeof req.session.regenerate !== 'function') {
    req.session.regenerate = (cb) => cb && cb();
  }
  if (typeof req.session.save !== 'function') {
    req.session.save = (cb) => cb && cb();
  }
  next();
});

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/files', fileRoutes);
const workflowRoutes = require('./routes/workflows');
app.use('/workflows', workflowRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Modern Web App Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/auth',
      files: '/files',
      workflows: '/workflows',
      health: '/health',
    },
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
const { globalErrorHandler } = require('./utils/errorHandler');
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
