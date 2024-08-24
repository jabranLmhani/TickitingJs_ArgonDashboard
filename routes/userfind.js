const express = require('express');
const router = express.Router();
const User = require('../model/User');

// Get users with optional search query
router.get('/', async (req, res) => {
  const { name } = req.query;
  try {
    const query = name ? { username: new RegExp(name, 'i') } : {};
    const users = await User.find(query).exec();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
