require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

app.use(express.json());

// Set up morgan to log requests in 'combined' format, which is similar to Nginx logs
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const authRoutes = require('./routes/auth');
const apikeyRoutes = require('./routes/apikey');
const logRoutes = require('./routes/logs');
const snippetRoutes = require('./routes/snippet');
const chatbotRoutes = require('./routes/chatbot');

// Use routes
app.use('/auth', authRoutes);
app.use(apikeyRoutes)
app.use(logRoutes);
app.use(snippetRoutes);
app.use(chatbotRoutes);

// Default route for serving the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
