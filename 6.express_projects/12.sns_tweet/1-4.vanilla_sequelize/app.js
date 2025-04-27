const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const path = require('path');
const { sequelize, User, Tweet, Like } = require('./models');

const app = express();

// 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));
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
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: '모든 필드를 입력하세요.' });
    }
    try {
        await User.create({ username, email, password });
        res.json({ message: '회원가입 성공!' });
    } catch (error) {
        res.status(400).json({ error: '이미 존재하는 사용자입니다.' });
    }
});

// 로그인
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || user.password !== password) {
        return res.status(401).json({ error: '이메일 또는 비밀번호가 틀렸습니다.' });
    }
    req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email,
    };
    res.json({ message: '로그인 성공!', user_id: user.id });
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

// 트윗 목록 가져오기
app.get('/api/tweets', async (req, res) => {
    try {
        const tweets = await Tweet.findAll({
            include: [{ model: User, attributes: ['username'] }],
            order: [['id', 'DESC']],
        });

        let likedTweetIds = [];
        if (req.session.user) {
            const likes = await Like.findAll({
                where: { user_id: req.session.user.id },
                attributes: ['tweet_id'],
            });
            likedTweetIds = likes.map(like => like.tweet_id);
        }

        const result = tweets.map(tweet => ({
            id: tweet.id,
            content: tweet.content,
            username: tweet.User.username,
            user_id: tweet.user_id,
            likes_count: tweet.likes_count,
            liked_by_current_user: likedTweetIds.includes(tweet.id),
        }));

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '트윗 조회 실패' });
    }
});

// 트윗 작성
app.post('/api/tweet', loginRequired, async (req, res) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: '내용을 입력하세요.' });
    }
    try {
        await Tweet.create({
            content,
            user_id: req.session.user.id,
        });
        res.json({ message: '트윗 작성 완료!' });
    } catch (error) {
        res.status(500).json({ error: '트윗 작성 실패' });
    }
});

// 트윗 삭제
app.delete('/api/tweet/:tweet_id', loginRequired, async (req, res) => {
    const tweetId = req.params.tweet_id;
    const tweet = await Tweet.findByPk(tweetId);

    if (!tweet) {
        return res.status(404).json({ error: '트윗이 존재하지 않습니다.' });
    }
    if (tweet.user_id !== req.session.user.id) {
        return res.status(403).json({ error: '삭제 권한이 없습니다.' });
    }

    await Like.destroy({ where: { tweet_id: tweetId } });
    await tweet.destroy();

    res.json({ message: '트윗 삭제 완료!' });
});

// 트윗 좋아요
app.post('/api/like/:tweet_id', loginRequired, async (req, res) => {
    const tweetId = req.params.tweet_id;

    await Like.create({
        user_id: req.session.user.id,
        tweet_id: tweetId,
    });

    await Tweet.increment('likes_count', { where: { id: tweetId } });

    res.json({ message: '좋아요 완료!' });
});

// 트윗 좋아요 취소
app.post('/api/unlike/:tweet_id', loginRequired, async (req, res) => {
    const tweetId = req.params.tweet_id;

    await Like.destroy({
        where: {
            user_id: req.session.user.id,
            tweet_id: tweetId,
        }
    });

    await Tweet.decrement('likes_count', { where: { id: tweetId } });

    res.json({ message: '좋아요 취소 완료!' });
});

// 프로필 수정
app.post('/api/profile/update', loginRequired, async (req, res) => {
    const { username, email } = req.body;
    if (!username || !email) {
        return res.status(400).json({ error: '모든 필드를 입력하세요.' });
    }
    try {
        await User.update(
            { username, email },
            { where: { id: req.session.user.id } }
        );
        res.json({ message: '프로필 수정 완료!' });
    } catch (error) {
        res.status(400).json({ error: '이미 존재하는 사용자명 또는 이메일입니다.' });
    }
});

// 비밀번호 변경
app.post('/api/profile/password', loginRequired, async (req, res) => {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
        return res.status(400).json({ error: '모든 필드를 입력하세요.' });
    }

    const user = await User.findByPk(req.session.user.id);

    if (!user) {
        return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
    if (user.password !== current_password) {
        return res.status(400).json({ error: '기존 비밀번호가 일치하지 않습니다.' });
    }

    await User.update(
        { password: new_password },
        { where: { id: req.session.user.id } }
    );

    res.json({ message: '비밀번호가 변경되었습니다.' });
});

// 서버 시작
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`서버가 포트 ${PORT}번에서 실행 중입니다.`);
    });
});
