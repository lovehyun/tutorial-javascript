// curl -X POST 127.0.0.1:3000/users -d username=user3 -d password=password3
// curl -X PUT 127.0.0.1:3000/users/2 -d username=user002 -d password=password002
// curl -X DELETE 127.0.0.1:3000/users/1
// curl -X PUT http://localhost:3000/users/1 -H "Content-Type: application/json" -d '{"username": "new_username", "password": "new_password"}'

const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// SQLite 데이터베이스 연결 (파일이 없으면 새로 생성됨)
const db = new sqlite3.Database('mydatabase.db');

// 테이블 생성 (사용자 정보를 저장하는 예시 테이블)
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
)`);

// 루트 경로에 대한 예시 핸들러 - 모든 사용자 조회
app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Internal Server Error');
        }
        res.json(rows);
    });
});

// 특정 사용자 조회
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Internal Server Error');
        }
        res.json(row);
    });
});

// 새로운 사용자 생성
app.post('/users', (req, res) => {
    const { username, password: passwsord } = req.body;

    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, passwsord], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Internal Server Error');
        }
        res.send(`User added with ID: ${this.lastID}`);
    });
});

// 사용자 정보 업데이트
/*
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { username, password: password } = req.body;
    
    db.run('UPDATE users SET username = ?, password = ? WHERE id = ?', [username, password, userId], (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Internal Server Error');
        }
        res.send('User updated successfully');
    });
});
*/

// 사용자 정보 업데이트 - 개선된 버전 (변경된 필드만 업데이트)
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { username, password } = req.body;

    // 업데이트할 필드와 값
    let fields = [];
    let values = [];

    if (username !== undefined) {
        fields.push("username = ?");
        values.push(username);
    }
    if (password !== undefined) {
        fields.push("password = ?");
        values.push(password);
    }

    // 업데이트할 필드가 없을 경우
    if (fields.length === 0) {
        return res.status(400).send("No fields provided for update.");
    }

    // 필드 개수와 values 배열 개수 일치 확인
    if (fields.length !== values.length) {
        return res.status(500).send("Field and value count mismatch. Please check input.");
    }
    
    // SQL 쿼리 작성
    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    values.push(userId);  // 마지막에 id 값을 추가하여 ?와 매칭

    db.run(query, values, (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Internal Server Error');
        }
        res.send('User updated successfully');
    });    
});

// 사용자 삭제
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    db.run('DELETE FROM users WHERE id = ?', [userId], (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Internal Server Error');
        }
        res.send('User deleted successfully');
    });
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
