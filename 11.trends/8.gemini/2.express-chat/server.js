import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config({ quiet: true });

const app = express();
app.use(express.json());
app.use(express.static('public'));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/chat', async (req, res) => {
    try {
        const msg = (req.body?.message || '').trim();
        if (!msg) return res.status(400).json({ error: 'message is required' });

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: msg,
        });

        const text = response.text || '';

        res.json({ reply: text });
    } catch (e) {
        res.status(500).json({ error: e?.message || String(e) });
    }
});

app.post('/api/reset', (_req, res) => {
    res.json({ ok: true });
});

app.listen(3000, () => console.log('http://localhost:3000'));
