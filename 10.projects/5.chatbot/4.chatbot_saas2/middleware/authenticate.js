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
    
    try {
        // Find user where the provided API key exists in the apiKeys array
        const user = await User.findOne({ 
            apiKeys: { $elemMatch: { key: apiKey } } // 하위 문서에서 검색
        });

        if (!user) {
            return res.status(401).send('Invalid API key.');
        }

        req.userId = user._id;
        req.apiKey = apiKey;

        next();
    } catch (error) {
        console.error('Error during API key authentication:', error);
        res.status(500).send('Internal server error.');
    }
};

module.exports = { authenticate, authenticateApiKey };
