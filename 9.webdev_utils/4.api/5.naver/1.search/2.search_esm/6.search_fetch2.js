import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const client_id = process.env.NAVER_CLIENT_ID;
const client_secret = process.env.NAVER_CLIENT_SECRET;

const text = '반갑습니다';
const encText = encodeURIComponent(text);
const url = `https://openapi.naver.com/v1/search/blog?query=${encText}`;

async function run() {
    try {
        const res = await fetch(url, {
            headers: {
                'X-Naver-Client-Id': client_id,
                'X-Naver-Client-Secret': client_secret,
            },
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        console.log(data);

    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
