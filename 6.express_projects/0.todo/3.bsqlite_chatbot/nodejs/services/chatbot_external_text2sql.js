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
const { getAllTodos } = require('../models/todoModel2');

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

function formatTodosForPrompt(todos) {
    if (!Array.isArray(todos) || todos.length === 0) return '할 일이 없습니다.';
    return todos.map((t, i) => `${i + 1}. ${t.text} [${t.completed ? '완료' : '미완료'}]`).join('\n');
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

function formatGenericSQLResult(result) {
    if (Array.isArray(result)) {
        if (result.length === 0) return '조회된 항목이 없습니다.';

        const firstRow = result[0];

        // SELECT COUNT(*) 대응
        if (Object.keys(firstRow).length === 1 && typeof Object.values(firstRow)[0] === 'number') {
            const key = Object.keys(firstRow)[0];
            return `총 ${firstRow[key]}개의 항목이 있습니다.`;
        }

        // text 및 completed 필드가 존재할 경우 포맷 출력
        if ('text' in firstRow) {
            return `총 ${result.length}개의 항목이 조회되었습니다:\n\n` +
                result.map((row, i) => {
                    const status = row.completed ? '완료' : '미완료';
                    return `${i + 1}. ${row.text} [${status}]`;
                }).join('\n');
        }

        // 일반 SELECT 결과
        const lines = result.map((row, i) =>
            `${i + 1}. ` + Object.entries(row).map(([k, v]) => `${k}: ${v}`).join(', ')
        );
        return `총 ${result.length}개의 항목이 조회되었습니다:\n\n${lines.join('\n')}`;

    } else if (result && typeof result === 'object' && 'changes' in result) {
        return `총 ${result.changes}개의 항목이 변경되었습니다.`;
    }

    return '결과를 해석할 수 없습니다.';
}

router.post('/api/chat', async (req, res) => {
    const { question } = req.body;
    if (!question) {
        return res.status(400).json({ answer: '질문을 입력해주세요.' });
    }

    try {
        // 현재 목록 조회
        const todos = getAllTodos();
        const formattedTodos = formatTodosForPrompt(todos);

        // 실제 DB로부터 스키마 추출
        const schema = getTableSchema('todos');

        // Flask 서버에 question + schema 전송
        const flaskRes = await axios.post(`${GPT_SERVER}/chat/text2sql`, {
            question,
            todos: formattedTodos,
            schema
        });

        const { sql, explanation } = flaskRes.data;
        console.log('생성된 SQL 및 설명:', sql, explanation);

        if (!sql) {
            // return res.status(400).json({ answer: 'GPT가 유효한 SQL을 생성하지 못했습니다.' });
            return res.status(200).json({ answer: explanation });
        }

        const result = executeSQL(db, sql);
        const formattedResult = formatGenericSQLResult(result);

        console.log('최종 응답:', formattedResult);

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
