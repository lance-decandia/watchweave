const express = require('express');
const axios = require('axios');
const router = express.Router();
const redisClient = require('../config/redis');
const JIKAN_BASE = 'https://api.jikan.moe/v4';
const CACHE_TTL = 3600;

async function getCache(key) {
  try {
    return await Promise.race([
      redisClient.get(key),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
    ]);
  } catch {
    return null;
  }
}

async function setCache(key, value) {
  try {
    await Promise.race([
      redisClient.setEx(key, CACHE_TTL, JSON.stringify(value)),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
    ]);
  } catch (err) {
    // Redis write failed silently — cache is optional
  }
}

router.get('/search', async (req, res) => {
  const { q, page = 1 } = req.query;
  if (!q) return res.status(400).json({ error: 'Query required' });
  const cacheKey = `search:${q}:${page}`;
  try {
    const cached = await getCache(cacheKey);
    if (cached) return res.json(JSON.parse(cached));
    const response = await axios.get(`${JIKAN_BASE}/anime`, { params: { q, page } });
    await setCache(cacheKey, response.data);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const cacheKey = `anime:${req.params.id}`;
  try {
    const cached = await getCache(cacheKey);
    if (cached) return res.json(JSON.parse(cached));
    const response = await axios.get(`${JIKAN_BASE}/anime/${req.params.id}`);
    await setCache(cacheKey, response.data);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/top/list', async (req, res) => {
  const cacheKey = 'top:anime';
  try {
    const cached = await getCache(cacheKey);
    if (cached) return res.json(JSON.parse(cached));
    const response = await axios.get(`${JIKAN_BASE}/top/anime`);
    await setCache(cacheKey, response.data);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
