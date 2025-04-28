// chatbot.js
const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./calendar.db');

// 챗봇 질문 처리
router.post('/api/chat', (req, res) => {
    const { question } = req.body;

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    const monthStr = `${yyyy}-${mm}`; // "2025-04" 같은 형태

    if (question.includes('오늘')) {
        db.all('SELECT * FROM schedule WHERE date = ?', [todayStr], (err, rows) => {
            if (err) return res.status(500).json({ answer: '일정 조회 중 오류가 발생했습니다.' });
            if (rows.length === 0) return res.json({ answer: '오늘은 일정이 없습니다.' });

            const list = rows.map((r, idx) => `${idx + 1}. ${r.title}: ${r.description || ''}`).join('\n');
            res.json({ answer: `오늘 일정입니다:\n${list}` });
        });
    } else if (question.includes('이번달') || question.includes('이달')) {
        db.all('SELECT * FROM schedule WHERE date LIKE ? ORDER BY date ASC, id ASC', [`${monthStr}-%`], (err, rows) => {
            if (err) return res.status(500).json({ answer: '일정 조회 중 오류가 발생했습니다.' });
            if (rows.length === 0) return res.json({ answer: '이번 달은 일정이 없습니다.' });

            // 심플하게 표현
            // const list = rows.map(r => `${r.date} - ${r.title}: ${r.description || ''}`).join('\n');
            // res.json({ answer: `이번 달 일정입니다:\n${list}` });

            // 날짜별로 그룹핑
            const grouped = {};
            rows.forEach((r) => {
                if (!grouped[r.date]) grouped[r.date] = [];
                grouped[r.date].push(r);
            });

            // 포맷팅
            let answer = '이번 달 일정입니다:\n';
            for (const date in grouped) {
                answer += `\n${date}:\n`;  // 날짜 출력
                grouped[date].forEach((r, idx) => {
                    answer += `${idx + 1}. ${r.title}: ${r.description || ''}\n`; // 번호 붙이기
                });
            }
            
            res.json({ answer: answer.trim() });
        });
    } else {
        res.json({ answer: '죄송합니다, 이해하지 못했습니다. "오늘 일정", "이번달 일정" 등을 질문해 주세요.' });
    }
});

module.exports = router;
