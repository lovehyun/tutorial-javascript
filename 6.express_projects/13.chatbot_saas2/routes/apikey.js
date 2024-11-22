const express = require('express');
const User = require('../models/user');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();

const generateApiKey = () => {
    return require('crypto').randomBytes(16).toString('hex');
};

router.get('/apikeys', authenticate, async (req, res) => {
    const user = await User.findById(req.userId);
    if (!user) {
        return res.status(404).send('User not found');
    }
    res.send({ apiKeys: user.apiKeys });
});

router.post('/apikey', authenticate, async (req, res) => {
    const user = await User.findById(req.userId);
    if (!user) {
        return res.status(404).send('User not found');
    }

    if (user.apiKeys.length >= 2) {
        return res.status(400).send({ error: 'Maximum of 2 API keys allowed.' });
    }

    const newApiKey = generateApiKey();
    user.apiKeys.push(newApiKey);
    await user.save();
    res.send({ apiKey: newApiKey, apiKeys: user.apiKeys });
});

router.delete('/apikey', authenticate, async (req, res) => {
    const { apiKey } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
        return res.status(404).send('User not found');
    }

    const index = user.apiKeys.indexOf(apiKey);
    if (index === -1) {
        return res.status(404).send({ error: 'API key not found.' });
    }

    user.apiKeys.splice(index, 1);
    await user.save();
    res.send({ message: 'API key deleted.', apiKeys: user.apiKeys });
});

module.exports = router;
