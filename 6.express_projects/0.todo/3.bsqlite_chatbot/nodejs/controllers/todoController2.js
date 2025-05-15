const todoModel = require('../models/todoModel');

function getAllTodos(req, res) {
    try {
        const todos = todoModel.getAllTodos();
        res.json(todos);
    } catch (err) {
        console.error('조회 오류:', err);
        res.status(500).json({ error: 'DB 조회 실패' });
    }
}

function addTodo(req, res) {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'text는 필수입니다.' });

    try {
        const info = todoModel.insertTodo(text);
        res.json({ id: info.lastInsertRowid, text, completed: false });
    } catch (err) {
        console.error('삽입 오류:', err);
        res.status(500).json({ error: 'DB 삽입 실패' });
    }
}

function toggleTodo(req, res) {
    const id = parseInt(req.params.id);
    try {
        const row = todoModel.getTodoById(id);
        if (!row) return res.status(404).json({ error: 'Not found' });

        const newCompleted = row.completed ? 0 : 1;
        todoModel.updateTodoCompleted(id, newCompleted);
        res.json({ id, text: row.text, completed: !!newCompleted });
    } catch (err) {
        console.error('토글 오류:', err);
        res.status(500).json({ error: 'DB 업데이트 실패' });
    }
}

function deleteTodo(req, res) {
    const id = parseInt(req.params.id);
    try {
        todoModel.deleteTodoById(id);
        res.json({ success: true });
    } catch (err) {
        console.error('삭제 오류:', err);
        res.status(500).json({ error: 'DB 삭제 실패' });
    }
}

module.exports = {
    getAllTodos,
    addTodo,
    toggleTodo,
    deleteTodo
};
