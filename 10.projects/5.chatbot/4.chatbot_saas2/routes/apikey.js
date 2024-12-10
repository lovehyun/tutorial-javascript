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
    res.send(user.apiKeys); // Return array of { key, title }
});

router.post('/apikeys', authenticate, async (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).send({ error: 'Title is required.' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
        return res.status(404).send('User not found');
    }

    if (user.apiKeys.length >= 2) {
        return res.status(400).send({ error: 'Maximum of 2 API keys allowed.' });
    }

    const newApiKey = {
        key: generateApiKey(),
        title,
    };

    user.apiKeys.push(newApiKey);
    await user.save();
    res.send({ apiKey: newApiKey, apiKeys: user.apiKeys });
});

router.delete('/apikeys', authenticate, async (req, res) => {
    const { apiKey } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
        return res.status(404).send('User not found');
    }

    // API 키 검색
    const index = user.apiKeys.findIndex(item => String(item.key) === String(apiKey));
    if (index === -1) {
        return res.status(404).send({ error: 'API key not found.' });
    }

    user.apiKeys.splice(index, 1);
    await user.save();
    res.send({ message: 'API key deleted.', apiKeys: user.apiKeys });
});

// API 키 기반으로 타이틀 정보 가져오기
router.post('/apikeys/titles', authenticate, async (req, res) => {
    const { apiKeys } = req.body;

    if (!Array.isArray(apiKeys) || apiKeys.length === 0) {
        return res.status(400).send({ error: 'Invalid or missing API keys.' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
        return res.status(404).send({ error: 'User not found.' });
    }

    const titles = apiKeys
        .map(apiKey => {
            const foundKey = user.apiKeys.find(k => k.key === apiKey);
            return foundKey ? { key: foundKey.key, title: foundKey.title || 'Untitled' } : null;
        })
        .filter(Boolean); // Remove null values

    res.send({ titles });
});

router.patch('/apikeys/title', authenticate, async (req, res) => {
    const { apiKey, newTitle } = req.body;

    if (!apiKey || !newTitle) {
        return res.status(400).send({ error: 'API key and new title are required.' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
        return res.status(404).send('User not found');
    }

    const apiKeyEntry = user.apiKeys.find(k => k.key === apiKey);
    if (!apiKeyEntry) {
        return res.status(404).send({ error: 'API key not found.' });
    }

    // Update the title
    apiKeyEntry.title = newTitle;

    await user.save();

    res.send({ message: 'API key title updated.', apiKeys: user.apiKeys });
});

module.exports = router;
