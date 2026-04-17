const express = require('express');
const pool = require('../config/database');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user watchlist
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM watchlist WHERE user_id = $1 ORDER BY updated_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add to watchlist
router.post('/', auth, async (req, res) => {
  const { anime_id, anime_title, anime_image, status, episodes_watched, total_episodes } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO watchlist (user_id, anime_id, anime_title, anime_image, status, episodes_watched, total_episodes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id, anime_id) DO UPDATE SET status = $5, episodes_watched = $6, updated_at = NOW()
       RETURNING *`,
      [req.user.id, anime_id, anime_title, anime_image, status, episodes_watched, total_episodes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update watchlist entry
router.put('/:anime_id', auth, async (req, res) => {
  const { status, episodes_watched } = req.body;
  try {
    const result = await pool.query(
      `UPDATE watchlist SET status = $1, episodes_watched = $2, updated_at = NOW()
       WHERE user_id = $3 AND anime_id = $4 RETURNING *`,
      [status, episodes_watched, req.user.id, req.params.anime_id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Entry not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete from watchlist
router.delete('/:anime_id', auth, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM watchlist WHERE user_id = $1 AND anime_id = $2',
      [req.user.id, req.params.anime_id]
    );
    res.json({ message: 'Removed from watchlist' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
