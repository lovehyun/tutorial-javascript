const express = require('express');
const morgan = require('morgan');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = 3000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());
app.use(express.static('public'));
app.use(morgan('dev'));

// 환율 데이터 (간단한 예시, 실제 API 연동 가능)
const exchangeRates = {
    "USD": 1.0,       // 기준 통화
    "KRW": 1300,
    "EUR": 0.85
};

/**
 * 환율 변환 로직 (FROM, TO 지원)
 */
function convertCurrency(amount, from, to) {
    if (!exchangeRates[from] || !exchangeRates[to]) {
        throw new Error('지원하지 않는 통화입니다.');
    }
    const baseAmount = amount / exchangeRates[from]; // 기준 통화(USD)로 변환
    const convertedAmount = baseAmount * exchangeRates[to];  
    return convertedAmount.toFixed(2);  // 정상적으로 변환 후 toFixed 적용
}

// 일반 텍스트 대화 요청 (GPT 사용)
app.post('/api/chat-stream', async (req, res) => {
    const { question } = req.body;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: question }]
        });

        // 사용자 질의와 응답을 터미널에 로깅
        console.log("📩 사용자 질문:", question);
        console.log("🤖 AI 응답:", response.choices[0].message.content);

        res.json({ answer: response.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error generating response');
    }
});

// 환율 변환에 대한 자연어 응답
app.post('/api/chat-currency', async (req, res) => {
    const { amount, from, to } = req.body;

    try {
        const convertedAmount = convertCurrency(amount, from, to);
        const message = `${amount} ${from} is equivalent to ${convertedAmount} ${to}.`;

        const gptPrompt = `
        Please explain the following currency conversion result in a clear, concise format without extra line breaks. 
        Use the following structure and keep each language in a single line.

        AI 환율 계산 결과:
         - 한국어: Explain the conversion in Korean
         - English: Explain the conversion in English
         - Chinese: Explain the conversion in Chinese

        Conversion result: ${message}
        `;

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful assistant that explains currency conversion.' },
                // { role: 'user', content: `Explain this in both Korean: ${message}` }
                // { role: 'user', content: `Explain this in both Korean and English: ${message}` }
                { role: 'user', content: gptPrompt }

            ]
        });

        res.json({ answer: response.choices[0].message.content, convertedAmount });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error processing currency conversion');
    }
});

// 서버 실행
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
