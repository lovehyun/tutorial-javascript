const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate');
const Log = require('../models/log');

// Route to get logs for a user
router.get('/logs', authenticate, async (req, res) => {
    const userId = req.userId;
    const logs = await Log.find({ userId }).sort({ timestamp: -1 });
    res.send(logs);
});

module.exports = router;
