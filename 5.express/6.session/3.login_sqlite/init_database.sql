-- sqlite3 users.db < init_users.sql
-- users.db에 들어갈 초기 데이터
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);

-- 암호화 할 경우 별도 파일로 추가
-- INSERT INTO users (username, password) VALUES ('user1', 'password1');
-- INSERT INTO users (username, password) VALUES ('user2', 'password2');
