const express = require('express');
const Database = require('./database_bettersqlite3');
const path = require('path');

const app = express();
const port = 3000;

// 미들웨어
app.use(express.json()); // POST body(JSON)
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const db = new Database();

// 홈
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index_fetch.html'));
});

/**
 * [REST API]
 * - GET    /api/boards            : 목록
 * - GET    /api/boards/:id         : 단건 조회
 * - POST   /api/boards            : 생성 (body)
 * - PUT    /api/boards/:id        : 수정 (query params)
 * - DELETE /api/boards/:id        : 삭제 (query params 또는 path만)
 */

// 목록 조회: GET /api/boards
app.get('/api/boards', async (req, res) => {
    try {
        const rows = await db.executeFetch('SELECT id, title, message FROM board ORDER BY id DESC');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// 단건 조회: GET /api/boards/:id
app.get('/api/boards/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            return res.status(400).json({ success: false, error: 'Invalid id' });
        }

        const rows = await db.executeFetch('SELECT id, title, message FROM board WHERE id = ?', [id]);
        if (!rows || rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Not found' });
        }

        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// 생성: POST /api/boards  (POST만 body 사용)
app.post('/api/boards', async (req, res) => {
    try {
        const { title, message } = req.body;

        if (!title || !message) {
            return res.status(400).json({ success: false, error: 'title, message는 필수입니다.' });
        }

        const sql = 'INSERT INTO board(title, message) VALUES(?, ?)';
        await db.execute(sql, [title, message]);

        res.status(201).json({ success: true, result: 'created' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// 수정: PUT /api/boards/:id  (JSON body 사용)
// 예: PUT /api/boards/3
// body: { "title": "새제목", "message": "새내용" }
app.put('/api/boards/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { title, message } = req.body;

        if (!Number.isInteger(id)) {
            return res.status(400).json({ success: false, error: 'Invalid id' });
        }
        if (!title || !message) {
            return res.status(400).json({ success: false, error: 'title, message는 필수입니다.' });
        }

        const sql = 'UPDATE board SET title=?, message=? WHERE id=?';
        await db.execute(sql, [title, message, id]);

        res.json({ success: true, result: 'updated' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// /api/boards?id=3
/*
app.delete('/api/boards', async (req, res) => {
    const id = Number(req.query.id);
*/

// 삭제: DELETE /api/boards/:id  (query params 또는 path만으로도 가능)
// 예1: /api/boards/3
// 예2: /api/boards/3?confirm=true  (원하시면 확인 플래그도 강제 가능)
app.delete('/api/boards/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            return res.status(400).json({ success: false, error: 'Invalid id' });
        }

        const sql = 'DELETE FROM board WHERE id=?';
        await db.execute(sql, [id]);

        res.json({ success: true, result: 'deleted' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
