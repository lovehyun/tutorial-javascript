const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// SQLite3 데이터베이스 연결
const db = new sqlite3.Database('todos.db', (err) => {
    if (err) {
        console.error('DB 연결 실패:', err);
    } else {
        console.log('DB 연결 성공');
        const query = `
            CREATE TABLE IF NOT EXISTS todos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                text TEXT NOT NULL,
                completed INTEGER DEFAULT 0
            )
        `;
        db.run(query, (err) => {
            if (err) {
                console.error('테이블 생성 실패:', err);
            }
        });
    }
});

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// 요청 로깅
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// 모든 To-Do 조회
app.get('/api/todos', (req, res) => {
    console.log('GET /api/todos 호출됨');
    const query = 'SELECT * FROM todos';
    db.all(query, (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'DB 조회 실패' });
        } else {
            const todos = rows.map(row => ({
                id: row.id,
                text: row.text,
                completed: !!row.completed
            }));
            res.json(todos);
        }
    });
});

// 새 To-Do 추가
app.post('/api/todos', (req, res) => {
    console.log('POST /api/todos 호출됨:', req.body);
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'text는 필수입니다.' });
    }
    const query = 'INSERT INTO todos (text, completed) VALUES (?, 0)';
    db.run(query, [text], function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'DB 삽입 실패' });
        } else {
            res.json({ id: this.lastID, text, completed: false });
        }
    });
});

// To-Do 완료 토글
app.put('/api/todos/:id/toggle', (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`PUT /api/todos/${id}/toggle 호출됨`);
    
    const selectQuery = 'SELECT * FROM todos WHERE id = ?';
    db.get(selectQuery, [id], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'DB 조회 실패' });
        } else if (!row) {
            res.status(404).json({ error: 'Not found' });
        } else {
            const newCompleted = row.completed ? 0 : 1;
            const updateQuery = 'UPDATE todos SET completed = ? WHERE id = ?';
            db.run(updateQuery, [newCompleted, id], function (err) {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'DB 업데이트 실패' });
                } else {
                    res.json({ id, text: row.text, completed: !!newCompleted });
                }
            });
        }
    });
});

// To-Do 삭제
app.delete('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`DELETE /api/todos/${id} 호출됨`);
    
    const query = 'DELETE FROM todos WHERE id = ?';
    db.run(query, [id], function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'DB 삭제 실패' });
        } else {
            res.json({ success: true });
        }
    });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
