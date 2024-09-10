const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = (req, res, next) => {
    const token = req.header('x-auth');
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded._id;
        next();
    } catch (ex) {
        res.status(401).send('Invalid token.');
    }
};

const authenticateApiKey = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).send('Access denied. No API key provided.');
    }

    const apiKey = authHeader.replace('Bearer ', '');
    const user = await User.findOne({ apiKey });
    if (!user) {
        return res.status(401).send('Invalid API key.');
    }

    req.userId = user._id;
    next();
};

module.exports = { authenticate, authenticateApiKey };
