CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS watchlist (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  anime_id INTEGER NOT NULL,
  anime_title VARCHAR(255) NOT NULL,
  anime_image VARCHAR(500),
  status VARCHAR(20) CHECK (status IN ('watching', 'completed', 'plan_to_watch', 'dropped')),
  episodes_watched INTEGER DEFAULT 0,
  total_episodes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, anime_id)
);
