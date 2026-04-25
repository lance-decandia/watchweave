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
const initDB = require('./config/init-db');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://watchweave-alb-2123412938.us-east-1.elb.amazonaws.com',
    'http://localhost',
    'http://localhost:3000',
    'http://localhost:8080',
  ],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/anime', animeRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/health', healthRoutes);

const PORT = process.env.PORT || 3000;

const start = async () => {
  await initDB();
  app.listen(PORT, () => {
    console.log(`WatchWeave backend running on port ${PORT}`);
  });
};

start();

module.exports = app;
