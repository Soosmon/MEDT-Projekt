const express = require('express');
const router = express.Router();
const db = require('../models/db');
const bcrypt = require('bcrypt');

// Registrierung
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username und Passwort erforderlich' });
  try {
    // Zuerst User in User-Tabelle anlegen (nur wenn nicht vorhanden)
    let [userRows] = await db.query('SELECT id FROM User WHERE username = ?', [username]);
    let userId;
    if (userRows.length === 0) {
      const [userResult] = await db.query('INSERT INTO User (username) VALUES (?)', [username]);
      userId = userResult.insertId;
    } else {
      userId = userRows[0].id;
    }
    // Dann User in AuthUser-Tabelle anlegen
    const hash = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO AuthUser (id, username, password) VALUES (?, ?, ?)', [userId, username, hash]);
    res.status(201).json({ message: 'Registrierung erfolgreich' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username und Passwort erforderlich' });
  try {
    const [rows] = await db.query('SELECT * FROM AuthUser WHERE username = ?', [username]);
    if (!rows[0]) return res.status(401).json({ error: 'Ungültige Zugangsdaten' });
    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid) return res.status(401).json({ error: 'Ungültige Zugangsdaten' });
    res.status(200).json({ message: 'Login erfolgreich', userId: rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
