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

// 테이블 생성 (사용자 및 상품 정보를 저장하는 테이블)
db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT,
    password TEXT
)`);

db.exec(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT,
    price INTEGER
)`);

// 사용자 데이터 삽입
const insertUser = db.prepare('INSERT INTO users (id, username, password) VALUES (?, ?, ?)');
users.forEach((user) => {
    insertUser.run(user.id, user.username, user.password);
});

// 상품 데이터 삽입
const insertProduct = db.prepare('INSERT INTO products (id, name, price) VALUES (?, ?, ?)');
products.forEach((product) => {
    insertProduct.run(product.id, product.name, product.price);
});

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

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
