import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const client_id = process.env.NAVER_CLIENT_ID;
const client_secret = process.env.NAVER_CLIENT_SECRET;

const BASE_URL = 'https://openapi.naver.com/v1/search/blog';

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

async function fetchMultiplePages({ query, pages = 3, display = 10 }) {
    const results = [];

    for (let page = 1; page <= pages; page++) {
        const data = await fetchBlogPage({ query, page, display });
        results.push(...data.items);

        // 네이버 API 과도 호출 방지(권장)
        await new Promise(r => setTimeout(r, 200));
    }

    return results;
}

// 사용 예
// (async () => {
//     const page1 = await fetchBlogPage({ query: '반갑습니다', page: 1 });
//     const page2 = await fetchBlogPage({ query: '반갑습니다', page: 2 });
//     const page3 = await fetchBlogPage({ query: '반갑습니다', page: 3 });

//     console.log('page1:', page1.items.length);
//     console.log('page2:', page2.items.length);
//     console.log('page3:', page3.items.length);
// })();


const items = await fetchMultiplePages({
    query: '반갑습니다',
    pages: 3,
    display: 10,
});

console.log(items);
console.log('총 개수:', items.length);
