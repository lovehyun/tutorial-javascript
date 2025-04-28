const { Tweet, User, Like } = require('../models');

// ORM 방식의 join 사용. 좋아요 한 트윗 목록도 User.findByPk(... include LikedTweets) 방식으로 N:M 관계를 ORM관계로 직접 조인
/*
async function getTweets(req, res) {
    try {
        // [1] 모든 트윗 가져오기 (작성자 정보 포함)
        // 이전: tweet JOIN user 쿼리를 SQL 직접 작성
        // 지금: ORM의 include 기능으로 User(username) 자동 조인
        const tweets = await Tweet.findAll({
            include: [{ model: User, attributes: ['username'] }],
            order: [['id', 'DESC']],
        });

        let likedTweetIds = [];
        if (req.session.user) {
            // [2] 로그인 사용자가 좋아요한 트윗 id 목록 가져오기
            // 이전: like 테이블에서 SELECT로 직접 조회
            // 지금: ORM N:M 관계 (User ➔ LikedTweets) 를 통해 가져옴
            const user = await User.findByPk(req.session.user.id, {
                include: { model: Tweet, as: 'LikedTweets' }, // 반드시 as: 'LikedTweets'로 설정 필요
            });

            // user가 없거나 LikedTweets가 없을 경우 대비하여 안전하게 처리
            likedTweetIds = user?.LikedTweets?.map(tweet => tweet.id) || [];
        }

        // [3] 최종 응답 가공
        // 이전: SQL 결과를 서버단에서 JSON 가공
        // 지금: ORM 결과를 toJSON() 후 필요한 필드만 평탄화(flatten) + liked_by_current_user 추가
        const result = tweets.map(tweet => ({
            ...tweet.toJSON(),                         // 트윗 기본 데이터 복사
            username: tweet.User.username,             // 작성자 이름 평탄화 (User.username -> tweet.username)
            liked_by_current_user: likedTweetIds.includes(tweet.id), // 로그인 사용자의 좋아요 여부 추가
        }));

        res.json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '트윗 조회 실패' });
    }
}
*/

async function getTweets(req, res) {
    try {
        // [1] 트윗 목록 가져오기 (작성자 이름 포함)
        const tweets = await Tweet.findAll({
            include: [{ model: User, attributes: ['username'] }],
            order: [['id', 'DESC']],
        });

        // [2] 로그인한 사용자가 좋아요한 tweet_id 리스트 가져오기
        let likedTweetIds = [];
        if (req.session.user) {
            const likes = await Like.findAll({
                where: { user_id: req.session.user.id },
                attributes: ['tweet_id'],
            });
            likedTweetIds = likes.map(like => like.tweet_id);
        }

        // [3] 최종 데이터 가공

        // const result = tweets.map(tweet => ({
        //     id: tweet.id,
        //     content: tweet.content,
        //     user_id: tweet.user_id,
        //     username: tweet.User.username,
        //     likes_count: tweet.likes_count,
        //     liked_by_current_user: likedTweetIds.includes(tweet.id),
        // }));

        const result = tweets.map(tweet => ({
            ...tweet.toJSON(), // 원래 tweet 정보를 그대로 풀어놓고
            username: tweet.User.username, // User.username을 평탄화
            liked_by_current_user: likedTweetIds.includes(tweet.id),  // 추가 필드
        }));

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '트윗 조회 실패' });
    }
}

async function postTweet(req, res) {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: '내용을 입력하세요.' });
    }
    try {
        await Tweet.create({ content, user_id: req.session.user.id });
        res.json({ message: '트윗 작성 완료!' });
    } catch (error) {
        res.status(500).json({ error: '트윗 작성 실패' });
    }
}

async function deleteTweet(req, res) {
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
}

module.exports = {
    getTweets,
    postTweet,
    deleteTweet,
};
