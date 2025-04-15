// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// 메모리 기반 To-Do 목록
let todos = [];
let idCounter = 1;

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // JSON 파싱

// 미들웨어: 모든 요청 로깅
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// 모든 To-Do 조회
app.get('/api/todos', (req, res) => {
    console.log('GET /api/todos 호출됨');
    res.json(todos);
});

// 새 To-Do 추가
app.post('/api/todos', (req, res) => {
    console.log('POST /api/todos 호출됨:', req.body);
    const { text } = req.body;
    const newTodo = { id: idCounter++, text, completed: false };
    todos.push(newTodo);
    res.json(newTodo);
});

// To-Do 완료 토글
app.put('/api/todos/:id/toggle', (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`PUT /api/todos/${id}/toggle 호출됨`);
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        res.json(todo);
    } else {
        res.status(404).json({ error: 'Not found' });
    }
});

// To-Do 삭제
app.delete('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`DELETE /api/todos/${id} 호출됨`);
    todos = todos.filter(t => t.id !== id);
    res.json({ success: true });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
