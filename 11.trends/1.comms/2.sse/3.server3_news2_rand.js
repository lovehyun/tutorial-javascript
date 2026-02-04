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

    const sendNext = () => {
        if (index >= newsArticles.length) {
            index = 0;
        }

        const news = newsArticles[index];
        res.write(`data: ${JSON.stringify({ news })}\n\n`);
        index++;

        // 매번 새로운 랜덤 시간 생성
        const randomDelay = Math.floor(Math.random() * 3000) + 2000; // 2~5초
        timeoutId = setTimeout(sendNext, randomDelay);
    };

    // 첫 전송 예약
    let timeoutId = setTimeout(sendNext, Math.floor(Math.random() * 3000) + 2000);

    req.on('close', () => {
        clearInterval(timeoutId);
        console.log('Client disconnected from news stream');
    });
});

app.get('/news-rand-stream', cors(sseCorsOptions), (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let timeoutId = null;

    const sendRandomNews = () => {
        // 뉴스 순번 랜덤
        const randomIndex = Math.floor(Math.random() * newsArticles.length);
        const news = newsArticles[randomIndex];

        // 뉴스 전송
        res.write(`data: ${JSON.stringify({ index: randomIndex, news })}\n\n`);

        // 다음 전송까지 랜덤 딜레이 (2~5초)
        const randomDelay = Math.floor(Math.random() * 3000) + 2000;
        timeoutId = setTimeout(sendRandomNews, randomDelay);
    };

    // 첫 전송 시작 (1초 후)
    timeoutId = setTimeout(sendRandomNews, 1000);

    req.on('close', () => {
        clearTimeout(timeoutId);
        console.log('Client disconnected from news stream');
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '3.news.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
    console.log('SSE News server running on http://localhost:3000');
});
