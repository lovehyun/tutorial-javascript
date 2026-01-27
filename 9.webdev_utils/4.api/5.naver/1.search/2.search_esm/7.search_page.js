import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const client_id = process.env.NAVER_CLIENT_ID;
const client_secret = process.env.NAVER_CLIENT_SECRET;

const BASE_URL = 'https://openapi.naver.com/v1/search/blog';

// async function fetchBlogPage(query, page = 1, display = 10) {
async function fetchBlogPage({ query, page = 1, display = 10 }) {
    const start = (page - 1) * display + 1;
    const url = `${BASE_URL}?query=${encodeURIComponent(query)}&display=${display}&start=${start}`;

    const res = await fetch(url, {
        headers: {
            'X-Naver-Client-Id': client_id,
            'X-Naver-Client-Secret': client_secret,
        },
    });

    if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }

    return res.json();
}

// 사용 예
const page1 = await fetchBlogPage({ query: '반갑습니다', page: 1 });
console.log('page1:', page1);

// (async () => {
//     const page1 = await fetchBlogPage({ query: '반갑습니다', page: 1 });
//     const page2 = await fetchBlogPage({ query: '반갑습니다', page: 2 });
//     const page3 = await fetchBlogPage({ query: '반갑습니다', page: 3 });

//     console.log('page1:', page1.items.length);
//     console.log('page2:', page2.items.length);
//     console.log('page3:', page3.items.length);
// })();

