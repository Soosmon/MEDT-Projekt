const express = require('express');
const router = express.Router();
const userModel = require('../models/user');

// GET /api/users - Liste aller registrierten User
router.get('/', async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
