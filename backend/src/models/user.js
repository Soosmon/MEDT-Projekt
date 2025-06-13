const db = require('./db');

// Alle registrierten User abrufen
async function getAllUsers() {
  const [rows] = await db.query('SELECT id, username FROM User');
  return rows;
}

module.exports = { getAllUsers };
