-- 참고: flask_sqlalchemy가 자동 초기화 해줌으로 수동 초기화 불필요
-- sqlite3 database.db < init_database.sql

-- User 테이블 생성
CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- Tweet 테이블 생성
CREATE TABLE IF NOT EXISTS tweet (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    likes_count INTEGER DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES user(id)
);

-- Like 테이블 생성
CREATE TABLE IF NOT EXISTS like (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    tweet_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES user(id),
    FOREIGN KEY(tweet_id) REFERENCES tweet(id)
);

-- Comment 테이블 생성
CREATE TABLE IF NOT EXISTS comment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tweet_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(tweet_id) REFERENCES tweet(id),
    FOREIGN KEY(user_id) REFERENCES user(id)
);

-- 좋아요 추가 시 likes_count +1 하는 트리거
-- CREATE TRIGGER IF NOT EXISTS increment_likes_count
-- AFTER INSERT ON like
-- FOR EACH ROW
-- BEGIN
--     UPDATE tweet
--     SET likes_count = likes_count + 1
--     WHERE id = NEW.tweet_id;
-- END;

-- 좋아요 삭제 시 likes_count -1 하는 트리거
-- CREATE TRIGGER IF NOT EXISTS decrement_likes_count
-- AFTER DELETE ON like
-- FOR EACH ROW
-- BEGIN
--     UPDATE tweet
--     SET likes_count = likes_count - 1
--     WHERE id = OLD.tweet_id;
-- END;


-- 사용자 삽입 (비밀번호는 단순 텍스트, 실서비스 시 암호화 필요)
INSERT INTO user (username, email, password) VALUES
('user1', 'user1@example.com', 'password1'),
('user2', 'user2@example.com', 'password2'),
('user3', 'user3@example.com', 'password3');

-- 트윗 삽입
INSERT INTO tweet (content, user_id, likes_count) VALUES
('안녕하세요, 첫 트윗입니다!', 1, 2),
('두 번째 트윗이에요!', 2, 1);

-- 좋아요 삽입
INSERT INTO like (user_id, tweet_id) VALUES
(2, 1),
(3, 1),
(1, 2);

-- 댓글 삽입
INSERT INTO comment (tweet_id, user_id, content) VALUES
(1, 2, '좋아요!'),
(1, 3, '멋져요!'),
(2, 1, '굿!');
