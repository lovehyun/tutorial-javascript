const db = require('./database');

function getAllTodos() {
    const rows = db.prepare('SELECT * FROM todos').all();
    return rows.map(row => ({
        id: row.id,
        text: row.text,
        completed: !!row.completed
    }));
}

function getIdFromItem(text) {
    const row = db.prepare('SELECT id FROM todos WHERE text LIKE ? ORDER BY id ASC LIMIT 1').get(`%${text}%`);
    return row ? row.id : null;
}

function insertTodo(text) {
    return db.prepare('INSERT INTO todos (text, completed) VALUES (?, 0)').run(text);
}

function getTodoById(id) {
    return db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
}

function updateTodoCompleted(id, completed) {
    return db.prepare('UPDATE todos SET completed = ? WHERE id = ?').run(completed, id);
}

function deleteTodoById(id) {
    return db.prepare('DELETE FROM todos WHERE id = ?').run(id);
}

module.exports = {
    getAllTodos,
    getIdFromItem,
    insertTodo,
    getTodoById,
    updateTodoCompleted,
    deleteTodoById
};
