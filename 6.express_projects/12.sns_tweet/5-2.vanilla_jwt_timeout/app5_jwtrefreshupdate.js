const express = require('express');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const sqlite3 = require('sqlite3');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const db = new sqlite3.Database('database.db');

const SECRET_KEY = 'your-secret-key';
// 추후 .env 사용 원할 경우:
// require('dotenv').config();
// const SECRET_KEY = process.env.SECRET_KEY;

// 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// 인증 미들웨어
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: '토큰이 없습니다.' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: '토큰이 유효하지 않습니다.' });
        req.user = user;
        next();
    });
}

// API 라우트

// 회원가입
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: '모든 필드를 입력하세요.' });
    }

    const query = 'INSERT INTO user (username, email, password) VALUES (?, ?, ?)';
    db.run(query, [username, email, password], function(err) {
        if (err) {
            return res.status(400).json({ error: '이미 존재하는 사용자입니다.' });
        }
        res.json({ message: '회원가입 성공!' });
    });
});

// 로그인
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM user WHERE email = ?';
    db.get(query, [email], (err, user) => {
        if (err || !user || user.password !== password) {
            return res.status(401).json({ error: '이메일 또는 비밀번호가 틀렸습니다.' });
        }

        const payload = { id: user.id, username: user.username, email: user.email };

        const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
        const refreshToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '30d' });

        res.json({ accessToken, refreshToken });
    });
});

// 토큰 리프레시 (Access Token만 새로 발급)
app.post('/api/refresh', (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(401).json({ error: 'Refresh Token이 없습니다.' });

    jwt.verify(refreshToken, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Refresh Token이 유효하지 않습니다.' });

        const payload = { id: user.id, username: user.username, email: user.email };
        const newAccessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

        res.json({ accessToken: newAccessToken });
    });
});

// Refresh Token 자체를 rotate
app.post('/api/rotate_refresh', (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(401).json({ error: 'Refresh Token이 없습니다.' });

    jwt.verify(refreshToken, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Refresh Token이 유효하지 않습니다.' });

        const payload = { id: user.id, username: user.username, email: user.email };
        const newRefreshToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '30d' });

        res.json({ refreshToken: newRefreshToken, refreshTokenIssuedAt: Date.now() });
    });
});

// 로그아웃
app.post('/api/logout', authenticateToken, (req, res) => {
    // 프런트엔드에서 구현하며 로컬스토리지에서 토큰 삭제
});

// 현재 사용자 정보
app.get('/api/me', authenticateToken, (req, res) => {
    res.json(req.user);
});

// 트윗 목록 (좋아요 여부 미체크 하는 간단한 버전)
// app.get('/api/tweets', (req, res) => {
//     const query = `
//         SELECT tweet.*, user.username
//         FROM tweet
//         JOIN user ON tweet.user_id = user.id
//         ORDER BY tweet.id DESC
//     `;
//     db.all(query, [], (err, tweets) => {
//         if (err) return res.status(500).json({ error: '트윗 조회 실패' });

//         res.json(tweets.map(tweet => ({ ...tweet, liked_by_current_user: false })));
//     });
// });

// 트윗 목록
app.get('/api/tweets', (req, res) => {
    const query = `
        SELECT tweet.*, user.username
        FROM tweet
        JOIN user ON tweet.user_id = user.id
        ORDER BY tweet.id DESC
    `;

    db.all(query, [], (err, tweets) => {
        if (err) {
            return res.status(500).json({ error: '트윗 조회 실패' });
        }

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            // 로그인 안한 경우: liked_by_current_user 전부 false
            const result = tweets.map(tweet => ({
                ...tweet,
                liked_by_current_user: false
            }));
            return res.json(result);
        }

        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                const result = tweets.map(tweet => ({
                    ...tweet,
                    liked_by_current_user: false
                }));
                return res.json(result);
            }

            db.all(`SELECT tweet_id FROM like WHERE user_id = ?`, [user.id], (err, likes) => {
                if (err) {
                    return res.status(500).json({ error: '좋아요 조회 실패' });
                }

                const likedTweetIds = likes.map(like => like.tweet_id);
                const result = tweets.map(tweet => ({
                    ...tweet,
                    liked_by_current_user: likedTweetIds.includes(tweet.id)
                }));
                res.json(result);
            });
        });
    });
});

// 트윗 작성
app.post('/api/tweet', authenticateToken, (req, res) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: '내용을 입력하세요.' });
    }

    const query = 'INSERT INTO tweet (content, user_id) VALUES (?, ?)';
    db.run(query, [content, req.user.id], function(err) {
        if (err) return res.status(500).json({ error: '트윗 작성 실패' });
        res.json({ message: '트윗 작성 완료!' });
    });
});

// 트윗 삭제
app.delete('/api/tweet/:tweet_id', authenticateToken, (req, res) => {
    const tweetId = req.params.tweet_id;

    db.get('SELECT * FROM tweet WHERE id = ?', [tweetId], (err, tweet) => {
        if (err || !tweet) return res.status(404).json({ error: '트윗이 존재하지 않습니다.' });

        if (tweet.user_id !== req.user.id) {
            return res.status(403).json({ error: '삭제 권한이 없습니다.' });
        }

        db.run('DELETE FROM tweet WHERE id = ?', [tweetId]);
        res.json({ message: '트윗 삭제 완료!' });
    });
});

// 트윗 좋아요
app.post('/api/like/:tweet_id', authenticateToken, (req, res) => {
    const tweetId = req.params.tweet_id;
    db.run('INSERT INTO like (user_id, tweet_id) VALUES (?, ?)', [req.user.id, tweetId]);
    db.run('UPDATE tweet SET likes_count = likes_count + 1 WHERE id = ?', [tweetId]);
    res.json({ message: '좋아요 완료!' });
});

// 트윗 좋아요 취소
app.post('/api/unlike/:tweet_id', authenticateToken, (req, res) => {
    const tweetId = req.params.tweet_id;
    db.run('DELETE FROM like WHERE user_id = ? AND tweet_id = ?', [req.user.id, tweetId]);
    db.run('UPDATE tweet SET likes_count = likes_count - 1 WHERE id = ?', [tweetId]);
    res.json({ message: '좋아요 취소 완료!' });
});

// 프로필 수정
app.post('/api/profile/update', authenticateToken, (req, res) => {
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).json({ error: '모든 필드를 입력하세요.' });
    }

    const query = 'UPDATE user SET username = ?, email = ? WHERE id = ?';
    db.run(query, [username, email, req.user.id], function(err) {
        if (err) {
            return res.status(400).json({ error: '이미 존재하는 사용자명 또는 이메일입니다.' });
        }
        res.json({ message: '프로필 수정 완료!' });
    });
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}번에서 실행 중입니다.`);
});
