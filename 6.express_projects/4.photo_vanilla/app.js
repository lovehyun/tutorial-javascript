// server.js
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();
const port = 3000;

app.use(morgan('dev'));
app.use(express.static('public')); // 정적 파일 제공
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // JSON 파싱

let posts = [];

app.get('/api/posts', (req, res) => {
    res.json(posts);
});

app.post('/api/posts', (req, res) => {
    const { title, content } = req.body;
    const date = new Date();
    posts.push({ title, content, date });
    res.status(201).json({ message: 'Post created' });
});

app.delete('/api/posts/:index', (req, res) => {
    const index = parseInt(req.params.index);
    if (index >= 0 && index < posts.length) {
        posts.splice(index, 1);
        res.json({ message: 'Deleted' });
    } else {
        res.status(404).json({ message: 'Not Found' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
