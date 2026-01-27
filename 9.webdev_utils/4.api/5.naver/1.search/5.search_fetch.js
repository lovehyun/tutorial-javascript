// Node.js 18 이상부터 내장 fetch 사용가능
// Node.js 16 이하라면 node-fetch 필요 
//  - npm install node-fetch 및 (v3부터는 ESM전용). import fetch from 'node-fetch';
//  - npm install node-fetch@2 에서는 const fetch = require('node-fetch'); 
require('dotenv').config({ quiet: true });

const client_id = process.env.NAVER_CLIENT_ID;
const client_secret = process.env.NAVER_CLIENT_SECRET;

const text = '반갑습니다';
const encText = encodeURIComponent(text);
const url = `https://openapi.naver.com/v1/search/blog?query=${encText}`;

async function run() {
    try {
        const res = await fetch(url, {
            method: 'GET',
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
