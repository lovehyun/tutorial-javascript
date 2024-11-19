require('dotenv').config();

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const isDebugMode = process.env.DEBUG === 'true';

// Middleware for logging in debug mode
if (isDebugMode) {
    console.log('Running in development mode. Debugging is enabled.');

    app.use((req, res, next) => {
        console.log(`[DEBUG] ${req.method} ${req.url}`);
        next();
    });
} else {
    console.log('Running in production mode. Debugging is disabled.');
}

// Example routes
app.get('/', (req, res) => {
    res.send(`Hello World! Environment: ${process.env.NODE_ENV}`);
});

app.get('/error', (req, res) => {
    const error = new Error('This is a test error.');
    if (isDebugMode) {
        console.error(`[DEBUG ERROR] ${error.message}`);
    }
    res.status(500).send('Something went wrong!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
});
