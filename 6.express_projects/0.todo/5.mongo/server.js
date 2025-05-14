const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

require('dotenv').config();

// MongoDB 연결
async function initDB() {
    try {
        // await mongoose.connect('mongodb://localhost:27017/your_database');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB 연결 성공');
    } catch (err) {
        console.error('MongoDB 연결 실패:', err);
        process.exit(1);
    }
}

// Mongoose 모델 정의
const todoSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

const Todo = mongoose.model('Todo', todoSchema);

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// 요청 로깅
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// 모든 To-Do 조회
app.get('/api/todos', async (req, res) => {
    console.log('GET /api/todos 호출됨');
    try {
        const query = {}; // 모든 문서 조회
        const todos = await Todo.find(query);
        res.json(todos.map(todo => ({
            id: todo._id,
            text: todo.text,
            completed: todo.completed
        })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'DB 조회 실패' });
    }
});

// 새 To-Do 추가
app.post('/api/todos', async (req, res) => {
    console.log('POST /api/todos 호출됨:', req.body);
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'text는 필수입니다.' });
    }
    try {
        const query = { text, completed: false };
        const newTodo = await Todo.create(query);
        res.json({ id: newTodo._id, text: newTodo.text, completed: newTodo.completed });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'DB 삽입 실패' });
    }
});

// To-Do 완료 토글
app.put('/api/todos/:id/toggle', async (req, res) => {
    const id = req.params.id;
    console.log(`PUT /api/todos/${id}/toggle 호출됨`);
    try {
        const findQuery = { _id: id };
        const todo = await Todo.findById(findQuery);
        if (!todo) {
            return res.status(404).json({ error: 'Not found' });
        }
        const updateQuery = { completed: !todo.completed };
        await Todo.updateOne(findQuery, updateQuery);
        res.json({ id: todo._id, text: todo.text, completed: !todo.completed });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'DB 업데이트 실패' });
    }
});

// To-Do 삭제
app.delete('/api/todos/:id', async (req, res) => {
    const id = req.params.id;
    console.log(`DELETE /api/todos/${id} 호출됨`);
    try {
        const deleteQuery = { _id: id };
        await Todo.deleteOne(deleteQuery);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'DB 삭제 실패' });
    }
});

// 서버 시작
app.listen(PORT, async () => {
    await initDB();
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
