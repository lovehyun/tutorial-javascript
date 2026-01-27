// https://developers.naver.com/docs/serviceapi/search/blog/blog.md

import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

dotenv.config({ quiet: true });

const client_id = process.env.NAVER_CLIENT_ID;
const client_secret = process.env.NAVER_CLIENT_SECRET;
const app = express();
const PORT = 3000;

// ENV 필수값 즉시 체크
if (!process.env.NAVER_CLIENT_ID || !process.env.NAVER_CLIENT_SECRET) {
    console.error('NAVER_CLIENT_ID 또는 NAVER_CLIENT_SECRET 이 설정되지 않았습니다.');
    console.error('서버를 시작할 수 없습니다. (.env 파일을 확인하세요)');
    process.exit(1);
}

// 정적 파일 제공
app.use(express.static('public'));
app.use(morgan('dev'));

app.use(cors({
    origin: 'http://127.0.0.1:5173',
}));

// app.use(cors({
//     origin: [
//         'http://127.0.0.1:5173',
//         'http://localhost:5173',
//     ],
// }));

const BASE_URL = 'https://openapi.naver.com/v1/search/blog';

async function fetchBlogPage({ query, page = 1, display = 10 }) {
    const start = (page - 1) * display + 1;

    const url =
        `${BASE_URL}?query=${encodeURIComponent(query)}` +
        `&display=${display}&start=${start}`;

    const res = await fetch(url, {
        headers: {
            'X-Naver-Client-Id': client_id,
            'X-Naver-Client-Secret': client_secret,
        },
    });

    if (!res.ok) {
        throw new Error(`Naver API Error: ${res.status} ${res.statusText}`);
    }

    return res.json();
}

// 블로그 검색 API (페이지 지원)
app.get('/search/blog', async (req, res) => {
    const query = req.query.query;

    const page = parseInt(req.query.page || '1', 10);
    const display = parseInt(req.query.display || '10', 10);

    if (!query) {
        return res.status(400).json({ error: 'query parameter is required' });
    }

    try {
        const data = await fetchBlogPage({ query, page, display });
        res.status(200).json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to fetch blog search result' });
    }
});

app.get('/', (req, res) => {
    res.redirect('/search2_page.html');
});

// 서버 실행
const server = app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`포트 ${PORT} 이미 사용 중`);
    } else {
        console.error('서버 에러');
        console.error(err);
    }
    process.exit(1);
});
