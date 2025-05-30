const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();

// const db = new sqlite3.Database('database.db');
const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the database.');
        // SQLite3은 연결(Connection)마다 별도로 PRAGMA foreign_keys = ON을 설정해야 하므로, 초기화 SQL 파일 말고 서버 코드 안에서도 켜야 함.
        db.run('PRAGMA foreign_keys = ON');
    }
});

// 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    // cookie: {
    //     maxAge: 7 * 24 * 60 * 60 * 1000 // 7일 동안 유지
    // }
    // cookie.maxAge 또는 cookie.expires가 설정됨 - 브라우저를 꺼도 쿠키 파일에 저장되어 살아남음. (persistent cookie)
    // cookie.maxAge 또는 cookie.expires가 설정 안 됨 - 브라우저 메모리 상에만 존재함. 브라우저를 닫으면 사라짐. (session cookie)
}));

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// 로그인 체크 미들웨어
function loginRequired(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ error: '로그인이 필요합니다.' });
    }
    next();
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
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email
        };
        res.json({ message: '로그인 성공!', user_id: user.id });
    });
});

// 로그아웃
app.post('/api/logout', loginRequired, (req, res) => {
    req.session.destroy(() => {
        res.json({ message: '로그아웃 성공!' });
    });
});

// 현재 로그인 사용자
app.get('/api/me', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.json(null);
    }
});

// 트윗 목록 가져오기 - 한번에 모두
/*
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

        if (req.session.user) {
            const userId = req.session.user.id;

            db.all(`SELECT tweet_id FROM like WHERE user_id = ?`, [userId], (err, likes) => {
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
        } else {
            res.json(tweets.map(tweet => ({ ...tweet, liked_by_current_user: false })));
        }
    });
});
*/

// 트윗 목록 가져오기 - 페이징 처리를 고려한 페이지 내 좋아요 정보만 조회
app.get('/api/tweets', (req, res) => {
    const page = parseInt(req.query.page) || 1;  // 기본 1페이지
    const limit = parseInt(req.query.limit) || 10; // 기본 10개
    const offset = (page - 1) * limit;

    const query = `
        SELECT tweet.*, user.username
        FROM tweet
        JOIN user ON tweet.user_id = user.id
        ORDER BY tweet.id DESC
        LIMIT ? OFFSET ?
    `;
    db.all(query, [limit, offset], (err, tweets) => {
        if (err) {
            return res.status(500).json({ error: '트윗 조회 실패' });
        }

        // 트윗 글이 없으면 빈 배열 반환
        if (tweets.length === 0) {
            return res.json([]);
        }

        if (req.session.user) {
            const userId = req.session.user.id;
            const tweetIds = tweets.map(tweet => tweet.id);

            // 현재 페이지 글 중에 로그인 사용자가 좋아요 한 글이 있는지 조회
            const placeholders = tweetIds.map(() => '?').join(',');
            const likeQuery = `
                SELECT tweet_id FROM like 
                WHERE user_id = ? 
                AND tweet_id IN (${placeholders})
            `;
            db.all(likeQuery, [userId, ...tweetIds], (err, likes) => {
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
        } else {
            res.json(tweets.map(tweet => ({ ...tweet, liked_by_current_user: false })));
        }
    });
});

// 트윗 작성
app.post('/api/tweet', loginRequired, (req, res) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: '내용을 입력하세요.' });
    }

    const query = 'INSERT INTO tweet (content, user_id) VALUES (?, ?)';
    db.run(query, [content, req.session.user.id], function(err) {
        if (err) {
            return res.status(500).json({ error: '트윗 작성 실패' });
        }
        res.json({ message: '트윗 작성 완료!' });
    });
});

// 트윗 삭제
app.delete('/api/tweet/:tweet_id', loginRequired, (req, res) => {
    const tweetId = req.params.tweet_id;

    db.get('SELECT * FROM tweet WHERE id = ?', [tweetId], (err, tweet) => {
        if (err || !tweet) {
            return res.status(404).json({ error: '트윗이 존재하지 않습니다.' });
        }
        if (tweet.user_id !== req.session.user.id) {
            return res.status(403).json({ error: '삭제 권한이 없습니다.' });
        }

        db.run('DELETE FROM like WHERE tweet_id = ?', [tweetId]);
        db.run('DELETE FROM tweet WHERE id = ?', [tweetId], function(err) {
            if (err) {
                return res.status(500).json({ error: '트윗 삭제 실패' });
            }
            res.json({ message: '트윗 삭제 완료!' });
        });
    });
});

// 트윗 좋아요
app.post('/api/like/:tweet_id', loginRequired, (req, res) => {
    const tweetId = req.params.tweet_id;

    db.run('INSERT INTO like (user_id, tweet_id) VALUES (?, ?)', [req.session.user.id, tweetId]);
    db.run('UPDATE tweet SET likes_count = likes_count + 1 WHERE id = ?', [tweetId]);
    res.json({ message: '좋아요 완료!' });
});

// 트윗 좋아요 취소
app.post('/api/unlike/:tweet_id', loginRequired, (req, res) => {
    const tweetId = req.params.tweet_id;

    db.run('DELETE FROM like WHERE user_id = ? AND tweet_id = ?', [req.session.user.id, tweetId]);
    db.run('UPDATE tweet SET likes_count = likes_count - 1 WHERE id = ?', [tweetId]);
    res.json({ message: '좋아요 취소 완료!' });
});

// 프로필 수정
app.post('/api/profile/update', loginRequired, (req, res) => {
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).json({ error: '모든 필드를 입력하세요.' });
    }

    const query = 'UPDATE user SET username = ?, email = ? WHERE id = ?';
    db.run(query, [username, email, req.session.user.id], function(err) {
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
