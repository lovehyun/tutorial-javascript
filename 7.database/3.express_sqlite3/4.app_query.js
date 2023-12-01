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

app.get('/products2', (req, res) => {
    const { name, price } = req.query;

    // 따옴표 삭제 함수
    function removeQuotes(value) {
        return value.replace(/["']/g, "");
    }

    // 쿼리를 동적으로 생성하는 함수
    function buildQuery() {
        let query = 'SELECT * FROM products';

        if (name && price) {
            // 이름과 가격이 모두 제공되는 경우
            query += ` WHERE name LIKE '%${removeQuotes(name)}%' AND price = ${price}`;
        } else if (name) {
            // 이름만 제공되는 경우
            query += ` WHERE name LIKE '%${removeQuotes(name)}%'`;
        } else if (price) {
            // 가격만 제공되는 경우
            query += ` WHERE price = ${price}`;
        }

        return query;
    }

    function buildQuery2() {
        let query = 'SELECT * FROM products';
        const conditions = [];
    
        if (name) {
            conditions.push(`name LIKE '%${removeQuotes(name)}%'`);
        }
    
        if (price) {
            conditions.push(`price = ${price}`);
        }
    
        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }
    
        return query;
    }

    // 동적으로 생성된 쿼리 실행
    const query = buildQuery2();
    db.all(query, (err, rows) => {
        if (err) {
            res.send('Error querying products');
            return;
        }

        res.json(rows);
    });
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
