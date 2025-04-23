-- sqlite3 shopping.db < init_database.sql
-- users 테이블
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- products 테이블
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price INTEGER NOT NULL
);

-- 샘플 사용자 데이터 삽입 (비밀번호는 평문으로 작성됨, 실무에서는 bcrypt 해시로 저장)
INSERT INTO users (username, password) VALUES ('user1', 'password1');
INSERT INTO users (username, password) VALUES ('user2', 'password2');

-- 샘플 상품 데이터 삽입
INSERT INTO products (name, price) VALUES ('Product 1', 2000);
INSERT INTO products (name, price) VALUES ('Product 2', 3000);
INSERT INTO products (name, price) VALUES ('Product 3', 1500);
