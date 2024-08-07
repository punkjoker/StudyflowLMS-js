const express = require('express');
const router = express.Router();
const pool = require('../db'); // Assuming you have a db.js file exporting your pool

// Fetch all chat messages
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT chats.id, users.username, chats.message, chats.timestamp FROM chats JOIN users ON chats.user_id = users.id ORDER BY chats.timestamp ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).send('Server error');
  }
});

// Post a new chat message
router.post('/', async (req, res) => {
  const { userId, message } = req.body;
  try {
    await pool.query('INSERT INTO chats (user_id, message) VALUES ($1, $2)', [userId, message]);
    res.status(201).send('Message sent');
  } catch (error) {
    console.error('Error posting chat message:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
