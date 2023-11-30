const express = require('express');
const sqlite3 = require('sqlite3');
const fs = require('fs');

const app = express();
const port = 3000;

// SQLite 데이터베이스 연결
const db = new sqlite3.Database('mydatabase.db');

// 사용자 데이터 초기화
const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' },
];

// 상품 데이터 초기화
const products = [
    { id: 1, name: 'Product 1', price: 2000 },
    { id: 2, name: 'Product 2', price: 3000 },
    { id: 3, name: 'Product 3', price: 1500 },
];

function initializeDatabase() {
    return new Promise((resolve, reject) => {
        // 사용자 테이블 생성
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT,
            password TEXT
        )`, function () {
            // 사용자 데이터가 없을 때만 초기화
            db.get('SELECT COUNT(*) AS count FROM users', (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (row && row.count === 0) {
                    // 사용자 데이터 삽입
                    const stmt = db.prepare('INSERT INTO users (id, username, password) VALUES (?, ?, ?)');

                    db.serialize(() => {
                        users.forEach((user) => {
                            stmt.run(user.id, user.username, user.password);
                        });

                        stmt.finalize();
                    });
                }
            });
        });

        // 상품 테이블 생성
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY,
            name TEXT,
            price INTEGER
        )`, function () {
            // 상품 데이터가 없을 때만 초기화
            db.get('SELECT COUNT(*) AS count FROM products', (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (row && row.count === 0) {
                    // 상품 데이터 삽입
                    const stmt = db.prepare('INSERT INTO products (id, name, price) VALUES (?, ?, ?)');

                    db.serialize(() => {
                        products.forEach((product) => {
                            stmt.run(product.id, product.name, product.price);
                        });

                        stmt.finalize();
                    });
                }

                resolve();
            });
        });
    });
}

function initializeDatabase_fromFile() {
    return new Promise((resolve, reject) => {
        // init_data.sql 파일 읽기
        const sql = fs.readFileSync('init_database.sql', 'utf8');

        // 파일 내의 SQL 쿼리 실행
        db.exec(sql, (err) => {
            if (err) {
                // 중복된 키 에러(SQLITE_CONSTRAINT)인 경우에만 처리
                if (err.errno === 19 && err.code === 'SQLITE_CONSTRAINT') {
                    console.warn('Database already initialized. Skipping initialization.');
                    resolve();
                } else {
                    console.error('Error initializing database:', err);
                    reject();
                }
            } else {
                console.log('Database initialized successfully');
                resolve();
            }
        });
    });
}

// 루트 경로에 대한 예시 핸들러
app.get('/', (req, res) => {
    res.send('Welcome to the Express API!');
});

// 사용자 조회 엔드포인트
app.get('/users', (req, res) => {
    // SQLite에서 데이터를 조회하는 예시 쿼리
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            res.send('Error querying users');
            return;
        }

        // 쿼리 결과를 클라이언트에게 전송
        res.json(rows);
    });
});

// 상품 조회 엔드포인트
app.get('/products', (req, res) => {
    // SQLite에서 데이터를 조회하는 예시 쿼리
    db.all('SELECT * FROM products', (err, rows) => {
        if (err) {
            res.send('Error querying products');
            return;
        }

        // 쿼리 결과를 클라이언트에게 전송
        res.json(rows);
    });
});

async function startServer() {
    try {
        // await initializeDatabase();
        await initializeDatabase_fromFile();

        // 서버 시작
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// 초기화 작업이 완료된 후 서버 시작
startServer();
