// https://ai.google.dev/gemini-api/docs/quickstart
const dotenv = require('dotenv');
dotenv.config();

const key = process.env.GOOGLE_API_KEY;

async function main() {
    if (!key) {
        console.error('GOOGLE_API_KEY가 .env에 없습니다.');
        process.exit(1);
    }

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

    const body = {
        contents: [{ parts: [{ text: 'Explain how AI works in a few words' }] }],
    };

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'x-goog-api-key': key,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        console.error('요청 실패:', res.status, res.statusText);
        console.log(await res.json());
        process.exit(1);
    }

    const data = await res.json();

    // 생성된 텍스트만 출력
    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ?? data;

    console.log(text);
}

main().catch(console.error);
