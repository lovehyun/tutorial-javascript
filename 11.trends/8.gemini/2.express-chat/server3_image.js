import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config({ quiet: true });

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    console.error('GEMINI_API_KEY가 없습니다. .env 파일을 확인하세요.');
    process.exit(1);
}

const app = express();
app.use(express.json());
app.use(express.static('public'));

const ai = new GoogleGenAI({ apiKey: API_KEY });

// 단일 데모용: 서버 메모리에 대화 저장(여러 사용자 동시 접속 시 섞일 수 있음)
let history = [];

/** 텍스트 챗 */
app.post('/api/chat', async (req, res) => {
    try {
        const msg = (req.body?.message || '').trim();
        if (!msg) return res.status(400).json({ error: 'message is required' });

        // "툴 호출/JSON/thought" 같은 출력 방지용 최소 규칙
        const system = {
            role: 'user',
            parts: [
                {
                    text: [
                        '규칙:',
                        '- 당신은 도구/액션을 호출할 수 없습니다.',
                        '- action/tool/thought/json 형태로 출력하지 마세요.',
                        '- 이미지 생성 요청이면 이미지 생성은 /img 명령으로 처리되니, 텍스트로만 안내하세요.',
                    ].join('\n'),
                },
            ],
        };

        history.push({ role: 'user', parts: [{ text: msg }] });
        history = history.slice(-20);

        const response = await ai.models.generateContent({
            // 여기 모델은 list-models 결과에 맞게 바꾸셔도 됩니다.
            model: 'gemini-3-flash-preview',
            contents: [system, ...history],
        });

        const text = response.text || '';
        history.push({ role: 'model', parts: [{ text }] });

        res.json({ reply: text });
    } catch (e) {
        res.status(500).json({ error: e?.message || String(e) });
    }
});

/** 이미지 생성 (/img ...) */
app.post('/api/image', async (req, res) => {
    try {
        const prompt = (req.body?.prompt || '').trim();
        if (!prompt) return res.status(400).json({ error: 'prompt is required' });

        const response = await ai.models.generateContent({
            // Gemini 이미지 모델 (환경/계정에 따라 이름이 다를 수 있어 ListModels로 확인 권장)
            model: 'gemini-2.5-flash-image',
            contents: prompt,
            // 필요하면:
            // config: { imageConfig: { aspectRatio: "1:1" } }
        });

        // 이미지(base64) part 찾기
        const parts = response?.candidates?.[0]?.content?.parts || [];
        const imgPart = parts.find((p) => p.inlineData?.data);

        if (!imgPart) {
            const text = parts
                .map((p) => p.text)
                .filter(Boolean)
                .join('\n');
            return res.json({ type: 'text', text: text || '이미지 생성 결과가 없습니다.' });
        }

        const b64 = imgPart.inlineData.data;
        const mime = imgPart.inlineData.mimeType || 'image/png';
        res.json({ type: 'image', dataUrl: `data:${mime};base64,${b64}` });
    } catch (e) {
        res.status(500).json({ error: e?.message || String(e) });
    }
});

app.post('/api/reset', (_req, res) => {
    history = [];
    res.json({ ok: true });
});

app.listen(3000, () => console.log('http://localhost:3000'));
