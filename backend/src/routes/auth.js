const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const router = express.Router();

// Track failed login attempts
const loginAttempts = {};
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

const checkLockout = (email) => {
  if (loginAttempts[email]) {
    const { attempts, lastAttempt } = loginAttempts[email];
    if (attempts >= MAX_ATTEMPTS && Date.now() - lastAttempt < LOCKOUT_TIME) {
      return true;
    }
    if (Date.now() - lastAttempt >= LOCKOUT_TIME) {
      delete loginAttempts[email];
    }
  }
  return false;
};

const recordFailedAttempt = (email) => {
  if (!loginAttempts[email]) {
    loginAttempts[email] = { attempts: 0, lastAttempt: Date.now() };
  }
  loginAttempts[email].attempts++;
  loginAttempts[email].lastAttempt = Date.now();
};

const clearAttempts = (email) => {
  delete loginAttempts[email];
};

// Register
router.post('/register', [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers and underscores'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );
    const token = jwt.sign({ id: result.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user: result.rows[0], token });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { email, password } = req.body;

  if (checkLockout(email)) {
    return res.status(429).json({ 
      error: 'Account temporarily locked due to too many failed attempts. Try again in 15 minutes.' 
      });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (!result.rows.length) {
      recordFailedAttempt(email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, result.rows[0].password);
    if (!valid) {
      recordFailedAttempt(email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    clearAttempts(email);
    const token = jwt.sign({ id: result.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      user: { id: result.rows[0].id, username: result.rows[0].username, email: result.rows[0].email }, 
      token 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
