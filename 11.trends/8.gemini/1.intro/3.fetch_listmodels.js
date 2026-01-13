// const dotenv = require('dotenv');
// dotenv.config();

import dotenv from 'dotenv';
dotenv.config({ quiet: true });

const key = process.env.GOOGLE_API_KEY;

async function run() {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
        headers: { 'x-goog-api-key': key },
    });

    if (!res.ok) {
        console.error('ListModels 실패:', res.status, res.statusText);
        console.log(await res.text());
        process.exit(1);
    }

    const data = await res.json();
    // 모델 이름만 보기 좋게
    console.log(data.models?.map((m) => m.name) ?? data);
}

run();
