const db = require('../models/database');

function getAllTodos(req, res) {
    try {
        const rows = db.prepare('SELECT * FROM todos').all();
        const todos = rows.map(row => ({
            id: row.id,
            text: row.text,
            completed: !!row.completed
        }));
        res.json(todos);
    } catch (err) {
        console.error('조회 오류:', err);
        res.status(500).json({ error: 'DB 조회 실패' });
    }
}

function addTodo(req, res) {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'text는 필수입니다.' });
    }

    try {
        const stmt = db.prepare('INSERT INTO todos (text, completed) VALUES (?, 0)');
        const info = stmt.run(text);
        res.json({ id: info.lastInsertRowid, text, completed: false });
    } catch (err) {
        console.error('삽입 오류:', err);
        res.status(500).json({ error: 'DB 삽입 실패' });
    }
}

function toggleTodo(req, res) {
    const id = parseInt(req.params.id);

    try {
        const row = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
        if (!row) return res.status(404).json({ error: 'Not found' });

        const newCompleted = row.completed ? 0 : 1;
        db.prepare('UPDATE todos SET completed = ? WHERE id = ?').run(newCompleted, id);
        res.json({ id, text: row.text, completed: !!newCompleted });
    } catch (err) {
        console.error('토글 오류:', err);
        res.status(500).json({ error: 'DB 업데이트 실패' });
    }
}

function deleteTodo(req, res) {
    const id = parseInt(req.params.id);

    try {
        db.prepare('DELETE FROM todos WHERE id = ?').run(id);
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
