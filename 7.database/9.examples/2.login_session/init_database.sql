-- init_database.sql
-- sqlite3 users.db < init_database.sql

-- 사용자 테이블 수정 (초기화할 때는 DROP TABLE을 사용)
DROP TABLE IF EXISTS users;

-- 사용자 테이블 재생성
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT,               -- 이메일 추가
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 가입 날짜
    role TEXT DEFAULT 'user'  -- 역할 (기본값: 'user')
);

-- 초기 사용자 데이터 삽입
INSERT INTO users (username, password, email, role) VALUES
    ('user1', 'password1', 'user1@example.com', 'admin'),
    ('user2', 'password2', 'user2@example.com', 'user'),
    ('user3', 'password3', 'user3@example.com', 'user');
