const express = require('express');
const axios = require('axios');
const router = express.Router();
const redisClient = require('../config/redis');

const JIKAN_BASE = 'https://api.jikan.moe/v4';
const CACHE_TTL = 3600;

// Search anime
router.get('/search', async (req, res) => {
  const { q, page = 1 } = req.query;
  if (!q) return res.status(400).json({ error: 'Query required' });

  const cacheKey = `search:${q}:${page}`;
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const response = await axios.get(`${JIKAN_BASE}/anime`, { params: { q, page } });
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(response.data));
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get anime by ID
router.get('/:id', async (req, res) => {
  const cacheKey = `anime:${req.params.id}`;
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const response = await axios.get(`${JIKAN_BASE}/anime/${req.params.id}`);
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(response.data));
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get top anime
router.get('/top/list', async (req, res) => {
  const cacheKey = 'top:anime';
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const response = await axios.get(`${JIKAN_BASE}/top/anime`);
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(response.data));
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
