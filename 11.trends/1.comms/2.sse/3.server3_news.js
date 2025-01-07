// curl -N http://localhost:3000/news-stream

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

const sseCorsOptions = {
    origin: 'http://127.0.0.1:3000',
    methods: 'GET',
    allowedHeaders: ['Content-Type'],
    optionsSuccessStatus: 200
};

const newsArticles = [
    "Breaking: Market sees significant rise today.",
    "Local hero saves cat from tree.",
    "Tech company launches innovative AI feature.",
    "Weather update: Sunny with a chance of rain.",
    "Sports: Home team wins the championship.",
    "Science: New discovery in quantum physics.",
    "Health: Benefits of daily meditation revealed.",
    "Politics: New policy announced for education reform."
];

// SSE 엔드포인트
app.get('/news-stream', cors(sseCorsOptions), (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendRandomNews = () => {
        const randomIndex = Math.floor(Math.random() * newsArticles.length);
        const news = newsArticles[randomIndex];
        res.write(`data: ${JSON.stringify({ news })}\n\n`);
    };

    const interval = setInterval(() => {
        sendRandomNews();
    }, Math.floor(Math.random() * 3000) + 2000);  // 2초에서 5초 랜덤 전송

    req.on('close', () => {
        clearInterval(interval);
        console.log('Client disconnected from news stream');
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'news.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
    console.log('SSE News server running on http://localhost:3000');
});
