const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = {
    posts: require('./data/posts.json'),
    comments: require('./data/comments.json'),
    albums: require('./data/albums.json'),
    photos: require('./data/photos.json'),
    todos: require('./data/todos.json'),
    users: require('./data/users.json'),
};

// 유틸: ID로 찾기
const findById = (list, id) => list.find((item) => item.id == id);

// 유틸: 새 ID 생성
const nextId = (list) => (Math.max(...list.map((i) => i.id)) || 0) + 1;

// 공통 CRUD
const createRoutes = (name) => {
    const items = db[name];

    app.get(`/${name}`, (req, res) => {
        const queryKey = Object.keys(req.query)[0];
        if (queryKey) {
            const filtered = items.filter((item) => item[queryKey] == req.query[queryKey]);
            return res.json(filtered);
        }
        res.json(items);
    });

    app.get(`/${name}/:id`, (req, res) => {
        const item = findById(items, req.params.id);
        item ? res.json(item) : res.status(404).json({ error: 'Not found' });
    });

    app.post(`/${name}`, (req, res) => {
        const newItem = { ...req.body, id: nextId(items) };
        items.push(newItem);
        res.status(201).json(newItem);
    });

    app.put(`/${name}/:id`, (req, res) => {
        const idx = items.findIndex((i) => i.id == req.params.id);
        if (idx === -1) return res.status(404).json({ error: 'Not found' });
        items[idx] = { ...req.body, id: items[idx].id };
        res.json(items[idx]);
    });

    app.patch(`/${name}/:id`, (req, res) => {
        const item = findById(items, req.params.id);
        if (!item) return res.status(404).json({ error: 'Not found' });
        Object.assign(item, req.body);
        res.json(item);
    });

    app.delete(`/${name}/:id`, (req, res) => {
        const idx = items.findIndex((i) => i.id == req.params.id);
        if (idx === -1) return res.status(404).json({ error: 'Not found' });
        const removed = items.splice(idx, 1)[0];
        res.json(removed);
    });
};

// 관계형 라우트 예시: GET /posts/:id/comments
app.get('/posts/:id/comments', (req, res) => {
    const postId = parseInt(req.params.id);
    const result = db.comments.filter((c) => c.postId === postId);
    res.json(result);
});

// 모든 리소스에 대해 CRUD 생성
['posts', 'comments', 'albums', 'photos', 'todos', 'users'].forEach(createRoutes);

app.listen(port, () => {
    console.log(`🟢 Mock JSONPlaceholder server running at http://localhost:${port}`);
});
