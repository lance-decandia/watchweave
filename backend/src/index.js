const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const animeRoutes = require('./routes/anime');
const watchlistRoutes = require('./routes/watchlist');
const healthRoutes = require('./routes/health');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/anime', animeRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/health', healthRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`WatchWeave backend running on port ${PORT}`);
});

module.exports = app;
