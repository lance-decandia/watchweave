const pool = require('./database');
const fs = require('fs');
const path = require('path');

const initDB = async () => {
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schema);
    console.log('Database schema initialized successfully');
  } catch (err) {
    console.error('Database initialization error:', err.message);
  }
};

module.exports = initDB;
