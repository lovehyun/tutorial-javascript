const express = require('express');
const sqlite = require('better-sqlite3');

const app = express();
const port = 3000;

// better-sqlite3 데이터베이스 연결
const db = new sqlite('mydatabase.db');

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
    // 사용자 테이블 생성
    const createUserTable = db.prepare(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT,
        password TEXT
    )`);

    // 사용자 데이터가 없을 때만 초기화
    const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;

    if (userCount === 0) {
        // 사용자 데이터 삽입
        const insertUser = db.prepare('INSERT INTO users (id, username, password) VALUES (?, ?, ?)');

        db.transaction(() => {
            users.forEach((user) => {
                insertUser.run(user.id, user.username, user.password);
            });
        })();
    }

    createUserTable.run();

    // 상품 테이블 생성
    const createProductTable = db.prepare(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT,
        price INTEGER
    )`);

    // 상품 데이터가 없을 때만 초기화
    const productCount = db.prepare('SELECT COUNT(*) AS count FROM products').get().count;

    if (productCount === 0) {
        // 상품 데이터 삽입
        const insertProduct = db.prepare('INSERT INTO products (id, name, price) VALUES (?, ?, ?)');

        db.transaction(() => {
            products.forEach((product) => {
                insertProduct.run(product.id, product.name, product.price);
            });
        })();
    }

    createProductTable.run();
}

// 루트 경로에 대한 예시 핸들러
app.get('/', (req, res) => {
    res.send('Welcome to the Express API!');
});

// 사용자 조회 엔드포인트
app.get('/users', (req, res) => {
    // better-sqlite3에서 데이터를 조회하는 예시 쿼리
    const query = db.prepare('SELECT * FROM users');
    const rows = query.all();

    // 쿼리 결과를 클라이언트에게 전송
    res.json(rows);
});

// 상품 조회 엔드포인트
app.get('/products', (req, res) => {
    // better-sqlite3에서 데이터를 조회하는 예시 쿼리
    const query = db.prepare('SELECT * FROM products');
    const rows = query.all();

    // 쿼리 결과를 클라이언트에게 전송
    res.json(rows);
});

async function startServer() {
    try {
        initializeDatabase();

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
