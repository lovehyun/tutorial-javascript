import express from 'express';
import db from '../database.js';
import { analyzeQuestion, generateAnswer } from './chatbot_openai.js';

const router = express.Router();

router.post('/api/chat', async (req, res) => {
    const { question } = req.body;

    let intent;
    try {
        intent = await analyzeQuestion(question);
    } catch (error) {
        console.error('analyzeQuestion 오류:', error);
        return res.json({ answer: '죄송합니다. 질문을 이해하는 데 실패했습니다.' });
    }

    console.log('OpenAI 응답:', intent);

    if (!intent || !intent.type) {
        return res.json({ answer: '죄송합니다. 질문을 이해하지 못했습니다. "오늘 일정 알려줘", "이번달 일정 알려줘"처럼 질문해 주세요.' });
    }

    if (intent.type === 'today') {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;

        db.all('SELECT * FROM schedule WHERE date = ? ORDER BY id ASC', [todayStr], async (err, rows) => {
            if (err) return res.status(500).json({ answer: '일정 조회 오류' });
            const answer = await generateAnswer(rows, 'today');
            res.json({ answer });
        });

    } else if (intent.type === 'tomorrow') {
        const today = new Date();
        today.setDate(today.getDate() + 1); // 하루 추가

        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const tomorrowStr = `${yyyy}-${mm}-${dd}`;

        db.all('SELECT * FROM schedule WHERE date = ? ORDER BY id ASC', [tomorrowStr], async (err, rows) => {
            if (err) return res.status(500).json({ answer: '일정 조회 오류' });
            const answer = await generateAnswer(rows, 'tomorrow');
            res.json({ answer });
        });

    } else if (intent.type === 'month') {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const monthStr = `${yyyy}-${mm}`;

        db.all('SELECT * FROM schedule WHERE date LIKE ? ORDER BY date ASC, id ASC', [`${monthStr}-%`], async (err, rows) => {
            if (err) return res.status(500).json({ answer: '일정 조회 오류' });
            const answer = await generateAnswer(rows, 'month');
            res.json({ answer });
        });

    } else {
        res.json({ answer: '죄송합니다. 아직 지원하지 않는 요청입니다. "오늘 일정", "이번달 일정", "내일 일정"만 가능합니다.' });
    }
});

export default router;
