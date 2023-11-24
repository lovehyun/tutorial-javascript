const express = require('express');
const sqlite3 = require('sqlite3');

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

// 루트 경로에 대한 예시 핸들러
app.get('/', (req, res) => {
    res.send('Welcome to the Express API!');
});

// 사용자 조회 엔드포인트
app.get('/users', (req, res) => {
    const { username } = req.query;

    if (username) {
        // 사용자 이름으로 검색
        const query = `SELECT * FROM users WHERE username LIKE '%${username}%'`;
        db.all(query, (err, rows) => {
            if (err) {
                res.send('Error querying users');
                return;
            }

            res.json(rows);
        });
    } else {
        // 모든 사용자 조회
        db.all('SELECT * FROM users', (err, rows) => {
            if (err) {
                res.send('Error querying users');
                return;
            }

            res.json(rows);
        });
    }
});

// 사용자 상세 정보 조회 엔드포인트
app.get('/users/:userId', (req, res) => {
    const userId = req.params.userId;
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) {
            res.send('Error querying user');
            return;
        }

        if (!row) {
            res.send('User not found');
            return;
        }

        res.json(row);
    });
});

// 상품 조회 엔드포인트
app.get('/products', (req, res) => {
    const { name } = req.query;

    if (name) {
        // 상품명으로 검색
        const query = `SELECT * FROM products WHERE name LIKE '%${name}%'`;
        db.all(query, (err, rows) => {
            if (err) {
                res.send('Error querying products');
                return;
            }

            res.json(rows);
        });
    } else {
        // 모든 상품 조회
        db.all('SELECT * FROM products', (err, rows) => {
            if (err) {
                res.send('Error querying products');
                return;
            }

            res.json(rows);
        });
    }
});

// 상품 상세 정보 조회 엔드포인트
app.get('/products/:productId', (req, res) => {
    const productId = req.params.productId;
    db.get('SELECT * FROM products WHERE id = ?', [productId], (err, row) => {
        if (err) {
            res.send('Error querying product');
            return;
        }

        if (!row) {
            res.send('Product not found');
            return;
        }

        res.json(row);
    });
});

async function startServer() {
    try {
        await initializeDatabase();

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
