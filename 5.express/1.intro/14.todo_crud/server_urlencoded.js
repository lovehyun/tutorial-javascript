// server.js
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// 🔹 JSON 대신 x-www-form-urlencoded만 사용
app.use(express.urlencoded({ extended: false }));

// 정적 파일 제공 (public/index.html)
app.use(express.static(path.join(__dirname, 'public')));

// 메모리 To-Do 저장소
let todos = [];
let nextId = 1;

// 목록 조회 (그냥 JSON 응답)
app.get('/api/todos', (req, res) => {
    res.json(todos);
});

// 새 항목 추가 (x-www-form-urlencoded 처리)
app.post('/api/todos', (req, res) => {
    // JSON이 아니라 form 데이터에서 text 읽기
    const text = req.body.text;
    if (!text || !text.trim()) {
        return res.status(400).json({ error: 'text is required' });
    }

    const newTodo = {
        id: nextId++,
        text: text.trim(),
        completed: false,
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// 삭제는 그대로 (DELETE라 바디 안 씀)
app.delete('/api/todos/:id', (req, res) => {
    const id = Number(req.params.id);
    todos = todos.filter((t) => t.id !== id);
    res.status(204).end();
});

app.listen(port, () => {
    console.log(`서버가 포트 ${port}에서 실행 중입니다. http://localhost:${port}`);
});
