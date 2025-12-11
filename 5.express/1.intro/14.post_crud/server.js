// server.js
const express = require('express');
const app = express();
const PORT = 3000;

// JSON 바디 파싱 미들웨어
app.use(express.json());

// 메모리 기반 posts 데이터
let posts = [
    { id: 1, title: '첫 번째 글', body: '내용입니다.' },
    { id: 2, title: '두 번째 글', body: '또 다른 내용입니다.' },
];
let nextId = 3;

/***************/
/* CRUD 라우트 */
/***************/

// 1) 전체 조회: GET /posts
app.get('/posts', (req, res) => {
    res.json(posts);
});

// 2) 한 개 조회: GET /posts/:id
app.get('/posts/:id', (req, res) => {
    const id = Number(req.params.id);
    const post = posts.find((p) => p.id === id);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
});

// 3) 생성: POST /posts
app.post('/posts', (req, res) => {
    const { title, body } = req.body;

    if (!title || !body) {
        return res.status(400).json({ error: 'title and body are required' });
    }

    const newPost = { id: nextId++, title, body };
    posts.push(newPost);

    res.status(201).json(newPost); // 201 Created
});

// 4) 전체 수정: PUT /posts/:id
app.put('/posts/:id', (req, res) => {
    const id = Number(req.params.id);
    const { title, body } = req.body;

    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }
    if (!title || !body) {
        return res.status(400).json({ error: 'title and body are required' });
    }

    // 통째로 교체
    posts[index] = { id, title, body };
    res.json(posts[index]);
});

// 5) 부분 수정: PATCH /posts/:id
app.patch('/posts/:id', (req, res) => {
    const id = Number(req.params.id);
    const { title, body } = req.body;

    const post = posts.find((p) => p.id === id);
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    if (title !== undefined) post.title = title;
    if (body !== undefined) post.body = body;

    res.json(post);
});

// 6) 삭제: DELETE /posts/:id
app.delete('/posts/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = posts.findIndex((p) => p.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }

    const deleted = posts.splice(index, 1)[0];
    res.json(deleted);
});

/***************/
/* 서버 시작   */
/***************/
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

/*
# 전체 조회
curl http://localhost:3000/posts

# 한 개 조회
curl http://localhost:3000/posts/1

# 생성
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"새 글\",\"body\":\"내용입니다\"}"

# 전체 수정 (PUT)
curl -X PUT http://localhost:3000/posts/1 \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"수정된 제목\",\"body\":\"수정된 내용\"}"

# 부분 수정 (PATCH)
curl -X PATCH http://localhost:3000/posts/1 \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"제목만 수정\"}"

# 삭제
curl -X DELETE http://localhost:3000/posts/1
*/
