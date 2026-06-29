const dotenv = require('dotenv');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// Load environment variables from .env file
dotenv.config();

const connectDB = require('./config/db');
const { generalLimiter } = require('./middleware/rateLimiter');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Connect to MongoDB
connectDB();

// Initialise Express application
const app = express();

// ---------------------------------------------------------------------------
// Global Middleware
// ---------------------------------------------------------------------------

// Security headers
app.use(helmet());

// CORS — allow the frontend origin with credentials (cookies)
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser — required for reading JWT from cookies
app.use(cookieParser());

// HTTP request logger (dev format)
app.use(morgan('dev'));

// Global rate limiter — 100 requests per 15 minutes per IP
app.use(generalLimiter);

// ---------------------------------------------------------------------------
// API Routes
// ---------------------------------------------------------------------------

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Health-check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// ---------------------------------------------------------------------------
// Error Handling
// ---------------------------------------------------------------------------

// Catch 404 and forward to error handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Start Server
// ---------------------------------------------------------------------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
