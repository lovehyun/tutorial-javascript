const express = require('express');
const sqlite3 = require('sqlite3').verbose();
// const sqlite3 = require('sqlite3');

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

// 초기 데이터베이스 초기화 함수
function initializeDatabase() {
    // 테이블 생성 (사용자 및 상품 정보를 저장하는 테이블)
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT,
        password TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT,
        price INTEGER
    )`);

    // 사용자 데이터 삽입
    users.forEach((user) => {
        db.run('INSERT INTO users (id, username, password) VALUES (?, ?, ?)', [user.id, user.username, user.password]); //, (err) => {}
    });

    // 상품 데이터 삽입
    products.forEach((product) => {
        db.run('INSERT INTO products (id, name, price) VALUES (?, ?, ?)', [product.id, product.name, product.price]); // , (err) => {}
    });
}

// 데이터베이스 초기화
initializeDatabase();

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

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
