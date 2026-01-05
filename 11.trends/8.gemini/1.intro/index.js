import dotenv from 'dotenv';
// import { GoogleGenerativeAI } from '@google/generative-ai'; // 구버전. 지금은 deprecated 되어서 동작하지 않음
import { GoogleGenAI } from '@google/genai';

dotenv.config();
// dotenv.config({ quiet: true });
// dotenv.config({ debug: false });

if (!process.env.GOOGLE_API_KEY) {
    console.error('GOOGLE_API_KEY가 없습니다. .env를 확인해주세요.');
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

async function run() {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: '인공지능을 3문장으로 아주 쉽게 설명해 주세요.',
    });

    console.log(response.text);
}

run().catch((e) => {
    console.error(e);
    process.exit(1);
});
