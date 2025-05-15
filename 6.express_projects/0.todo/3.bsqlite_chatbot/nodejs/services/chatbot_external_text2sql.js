// [Client] 
//    ↓
// [Node.js Express]
//    ↓ (question + schema 전달)
// [Flask (/chat/text2sql)]
//    ↓ (GPT를 통해 SQL 생성)
//    ← {"sql": "...", "explanation": "..."}

// [Node.js가 SQL 실행]

const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../models/database');

const GPT_SERVER = 'http://127.0.0.1:5000';

/**
 * DB 테이블 스키마를 자동으로 가져오는 함수
 */
function getTableSchema(tableName = 'todos') {
    const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();

    const schemaText = `[${tableName} 테이블]\n` + columns.map(col =>
        `- ${col.name}: ${col.type}${col.pk ? ' PRIMARY KEY' : ''}`
    ).join('\n');

    return schemaText;
}

function executeSQL(db, sql) {
    const trimmed = sql.trim().toLowerCase();
    
    if (trimmed.startsWith('select')) {
        return db.prepare(sql).all();
    } else {
        const stmt = db.prepare(sql);
        const info = stmt.run();
        return { changes: info.changes };
    }
}

function formatTodoResults(results) {
    if (!Array.isArray(results) || results.length === 0) {
        return '조회된 항목이 없습니다.';
    }

    const lines = results.map((item, index) => {
        const status = item.completed ? '완료' : '미완료';
        return `${index + 1}. ${item.text} [${status}]`;
    });

    return `총 ${results.length}개의 항목이 있습니다:\n\n${lines.join('\n')}`;
}

router.post('/api/chat', async (req, res) => {
    const { question } = req.body;
    if (!question) {
        return res.status(400).json({ answer: '질문을 입력해주세요.' });
    }

    try {
        // 실제 DB로부터 스키마 추출
        const schema = getTableSchema('todos');

        // Flask 서버에 question + schema 전송
        const flaskRes = await axios.post(`${GPT_SERVER}/chat/text2sql`, {
            question,
            schema
        });

        const { sql, explanation } = flaskRes.data;

        if (!sql) {
            return res.status(400).json({ answer: 'GPT가 유효한 SQL을 생성하지 못했습니다.' });
        }

        console.log('생성된 SQL 및 설명:', sql, explanation);

        const result = executeSQL(db, sql);
        
        // 클라이언트에 반환
        let formattedResult = '';
        if (Array.isArray(result)) {
            formattedResult = formatTodoResults(result);
        } else {
            formattedResult = `총 ${result.changes}개의 항목이 변경되었습니다.`;
        }

        return res.json({
            sql,
            answer: `${formattedResult}`
        });

    } catch (err) {
        console.error('Flask 오류:', err.response?.data || err.message);
        res.status(500).json({ answer: 'GPT 처리 서버 오류' });
    }
});

module.exports = router;
