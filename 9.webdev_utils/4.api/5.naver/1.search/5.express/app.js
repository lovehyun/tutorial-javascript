// https://developers.naver.com/docs/serviceapi/search/blog/blog.md#%EB%B8%94%EB%A1%9C%EA%B7%B8

require('dotenv').config();
const express = require('express');
const request = require('request');
const morgan = require('morgan');

const app = express();
const client_id = process.env.NAVER_CLIENT_ID;
const client_secret = process.env.NAVER_CLIENT_SECRET;

// 정적 파일 제공
app.use(express.static('public'));
app.use(morgan('dev'));

// 블로그 검색 API
app.get('/search/blog', (req, res) => {
    const api_url = `https://openapi.naver.com/v1/search/blog?query=${encodeURI(req.query.query)}`;
    const options = {
        url: api_url,
        headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret },
    };

    request.get(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            res.status(200).json(JSON.parse(body));
        } else {
            res.status(response.statusCode).send({ error: response.statusCode });
        }
    });
});

// 서버 실행
app.listen(3000, () => {
    console.log('Server running at http://127.0.0.1:3000');
});
