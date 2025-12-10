// server.js
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// JSON 바디 파싱
app.use(express.json());

// public 폴더 정적 서비스
app.use(express.static(path.join(__dirname, 'public')));

// 메모리 To-Do 저장소 (간단히)
let todos = [];
let nextId = 1;

// 전체 목록 조회
app.get('/api/todos', (req, res) => {
    res.json(todos);
});

// 새 항목 추가
app.post('/api/todos', (req, res) => {
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

// 항목 삭제
app.delete('/api/todos/:id', (req, res) => {
    const id = Number(req.params.id);
    todos = todos.filter((t) => t.id !== id);
    res.status(204).end();
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 포트 ${port}에서 실행 중입니다. http://localhost:${port}`);
});
