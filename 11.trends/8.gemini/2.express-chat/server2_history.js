import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config({ quiet: true });

const app = express();
app.use(express.json());
app.use(express.static('public'));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 최소: 서버 메모리에 대화 저장(사용자별 세션 분리 X)
let history = [];

app.post('/api/chat', async (req, res) => {
    try {
        const msg = (req.body?.message || '').trim();
        if (!msg) return res.status(400).json({ error: 'message is required' });

        // 대화 히스토리(최소한) 유지
        history.push({ role: 'user', parts: [{ text: msg }] });
        history = history.slice(-20); // 너무 길어지지 않게 컷

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: history,
        });

        const text = response.text || '';
        history.push({ role: 'model', parts: [{ text }] });

        res.json({ reply: text });
    } catch (e) {
        res.status(500).json({ error: e?.message || String(e) });
    }
});

app.post('/api/reset', (_req, res) => {
    history = [];
    res.json({ ok: true });
});

app.listen(3000, () => console.log('http://localhost:3000'));
