// server.js
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let posts = [
    { id: 1, title: 'First Post', body: 'This is the first post.' },
    { id: 2, title: 'Second Post', body: 'This is the second post.' }
];

// 전체 조회
app.get('/posts', (req, res) => {
    res.json(posts);
});

// 단일 조회
app.get('/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const post = posts.find(p => p.id === id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json(post);
});

// 생성
app.post('/posts', (req, res) => {
    const { title, body } = req.body;
    const newPost = { id: Date.now(), title, body };
    posts.push(newPost);
    res.status(201).json(newPost);
});

// 수정
app.put('/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const post = posts.find(p => p.id === id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    post.title = req.body.title ?? post.title;
    post.body = req.body.body ?? post.body;
    res.json(post);
});

// 삭제
app.delete('/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Not found' });
    const deleted = posts.splice(index, 1);
    res.json(deleted[0]);
});

app.listen(port, () => {
    console.log(`✅ Server running: http://localhost:${port}`);
});
