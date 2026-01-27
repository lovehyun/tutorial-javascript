// https://developers.naver.com/docs/serviceapi/search/blog/blog.md#%EB%B8%94%EB%A1%9C%EA%B7%B8

import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
// import cors from 'cors';

dotenv.config({ quiet: true });

const app = express();
const client_id = process.env.NAVER_CLIENT_ID;
const client_secret = process.env.NAVER_CLIENT_SECRET;

// 정적 파일 제공
app.use(express.static('public'));
app.use(morgan('dev'));

// app.use(cors({
//     origin: 'http://127.0.0.1:5173',
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


// 블로그 검색 API
// app.get('/search/blog/:query', (req, res) => {
//     const query = req.params.query;
//     if (!query) {
//         return res.status(400).json({ error: 'query parameter is required' });
//     }
//     const api_url = `https://openapi.naver.com/v1/search/blog?query=${encodeURI(req.query.query)}`;

app.get('/search/blog', async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).json({ error: 'query parameter is required' });
    }

    try {
        const data = await fetchBlogPage({ query });
        res.status(200).json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to fetch blog search result' });
    }
});

// app.get('/', (req, res) => {
//     res.redirect('/search.html');
// });

import path from 'path';
import { fileURLToPath } from 'url';

// __dirname 대체 (ESM일 경우)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 루트 접속 시 search.html 반환
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

// 서버 실행
app.listen(3000, () => {
    console.log('Server running at http://127.0.0.1:3000');
});

// curl "http://127.0.0.1:3000/search/blog?query=%EC%BB%A4%ED%94%BC"
