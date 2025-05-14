const express = require('express');
const router = express.Router();
const {
    getAllTodos,
    addTodo,
    toggleTodo,
    deleteTodo
} = require('../controllers/todoController');

// 할 일 목록 조회
router.get('/api/todos', getAllTodos);

// 할 일 추가
router.post('/api/todos', addTodo);

// 할 일 완료 토글
router.put('/api/todos/:id/toggle', toggleTodo);

// 할 일 삭제
router.delete('/api/todos/:id', deleteTodo);

module.exports = router;
