// services/chatbot_external.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../models/database');

const GPT_SERVER = 'http://127.0.0.1:5000';

router.post('/api/chat', async (req, res) => {
    const { question } = req.body;
    if (!question) return res.status(400).json({ answer: '질문을 입력해주세요.' });

    try {
        const todos = getTodos();

        const flaskRes = await axios.post(`${GPT_SERVER}/chat`, {
            question,
            todos
        });

        console.log(flaskRes.data) // 디버깅
        const { action, text } = flaskRes.data;

        switch (action) {
            case 'add':
                addTodo(text);
                return res.json({ answer: `할 일 추가됨: ${text}` });

            case 'done': {
                const updated = markTodoAsDone(text, todos);
                return res.json({ answer: updated ? `할 일 완료 처리됨: ${updated}` : `완료할 항목이 없습니다.` });
            }

            case 'delete': {
                const deleted = deleteTodoByText(text, todos);
                return res.json({ answer: deleted ? `삭제됨: ${deleted}` : `삭제할 항목이 없습니다.` });
            }

            case 'list': {
                const list = todos.map((t, i) => `${i + 1}. ${t.text} [${t.completed ? "완료" : "미완료"}]`).join('\n');
                return res.json({ answer: `현재 할 일 목록입니다:\n${list}` });
            }

            case 'summary':
                return res.json({ answer: '요약 요청입니다. 추후 처리 예정.' });

            default:
                return res.json({ answer: '요청을 이해하지 못했습니다.' });
        }

    } catch (err) {
        console.error('Flask 요청 오류:', err.response?.data || err.message);
        res.status(500).json({ answer: 'GPT 처리 서버 오류' });
    }
});

function getTodos() {
    const rows = db.prepare('SELECT * FROM todos').all();
    return rows.map(r => ({ id: r.id, text: r.text, completed: !!r.completed }));
}

function addTodo(text) {
    db.prepare('INSERT INTO todos (text, completed) VALUES (?, 0)').run(text);
}

function markTodoAsDone(text, todos) {
    const target = todos.find(t => t.text.includes(text));
    if (!target) return null;

    db.prepare('UPDATE todos SET completed = 1 WHERE id = ?').run(target.id);
    return target.text;
}

function deleteTodoByText(text, todos) {
    const target = todos.find(t => t.text.includes(text));
    if (!target) return null;

    db.prepare('DELETE FROM todos WHERE id = ?').run(target.id);
    return target.text;
}

module.exports = router;
