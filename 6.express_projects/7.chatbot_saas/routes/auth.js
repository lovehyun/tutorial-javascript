const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();

const generateApiKey = () => {
    return require('crypto').randomBytes(16).toString('hex');
};

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    const apiKey = generateApiKey();
    const user = new User({ email, password: hashedPassword, apiKey });
    try {
        await user.save();
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.header('x-auth', token).send({ apiKey });
    } catch (error) {
        res.status(400).send(error);
    }
});

// Route to login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
  
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
});

router.get('/me', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password -apiKey');
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Route to get API key
router.get('/apikey', authenticate, async (req, res) => {
    const user = await User.findById(req.userId);
    if (!user) {
        return res.status(404).send('User not found');
    }
    res.send({ apiKey: user.apiKey });
});

// Route to generate a new API key
router.post('/apikey', authenticate, async (req, res) => {
    const newApiKey = generateApiKey();
    await User.findByIdAndUpdate(req.userId, { apiKey: newApiKey });
    res.send({ apiKey: newApiKey });
});

module.exports = router;
