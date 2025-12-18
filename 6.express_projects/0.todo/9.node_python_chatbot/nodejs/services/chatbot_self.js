const express = require('express');
const router = express.Router();

const { OpenAI } = require('openai');

const db = require('../models/database');

require('dotenv').config({ path: '../.env' });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 질문 반납하는
router.post('/api/chat/echo', (req, res) => {
    const { question } = req.body;
    if (!question) {
        return res.status(400).json({ answer: '질문을 입력해주세요.' });
    }
    return res.json({ answer: `Echo: ${question}` });
});

// Chat 요청 처리
router.post('/api/chat', async (req, res) => {
    const { question } = req.body;
    if (!question) return res.status(400).json({ answer: '질문을 입력해주세요.' });

    try {
        const todos = getTodos();
        const systemPrompt = buildPrompt2(todos);
        const rawResponse = await requestChatGPT(systemPrompt, question);

        let parsed;
        try {
            parsed = JSON.parse(rawResponse);
        } catch (e) {
            console.error('JSON 파싱 실패:', e);
            return res.status(500).json({ answer: '챗봇 응답을 이해할 수 없습니다.' });
        }

        const { action, text } = parsed;
        console.log('GPT 응답:', parsed);

        switch (action) {
            case 'add':
                addTodo(text);
                return res.json({ answer: `할 일 추가됨: ${text}` });

            case 'done':
                const updated = markTodoAsDone(text, todos);
                return res.json({
                    answer: updated ? `할 일 완료 처리됨: ${updated}` : `완료 처리할 항목을 찾을 수 없습니다: ${text}`
                });

            case 'delete':
                const deleted = deleteTodoByText(text, todos);
                return res.json({
                    answer: deleted ? `할 일 삭제됨: ${deleted}` : `삭제할 항목을 찾을 수 없습니다: ${text}`
                });

            case 'list':
                const list = todos.map((t, i) => `${i + 1}. ${t.text} [${t.completed ? "완료" : "미완료"}]`).join('\n');
                return res.json({ answer: `현재 할 일 목록입니다:\n${list}` });

            case 'summary':
                const doneList = todos.filter(t => t.completed);
                const undoneList = todos.filter(t => !t.completed);
                const summaryPrompt = buildSummaryPrompt(doneList, undoneList);
                const summaryText = await requestChatGPT(summaryPrompt, '오늘 할 일 요약해줘');
                return res.json({ answer: summaryText });

            default:
                return res.json({ answer: '요청을 이해하지 못했습니다. "할 일 추가", "삭제", "요약" 등을 요청해 주세요.' });
        }

    } catch (err) {
        console.error('Chatbot 처리 오류:', err);
        return res.status(500).json({ answer: '챗봇 처리 중 오류가 발생했습니다.' });
    }
});

// 동기 방식 DB 처리 함수들
function getTodos() {
    return db.prepare('SELECT * FROM todos').all();
}

function addTodo(text) {
    db.prepare('INSERT INTO todos (text, completed) VALUES (?, 0)').run(text);
}

function markTodoAsDone(text, todos) {
    const target = todos.find(t => t.text.includes(text));
    if (!target) return null;
    db.prepare('UPDATE todos SET completed = 1 WHERE id = ?').run(target.id);
    return target.text;
}

function deleteTodoByText(text, todos) {
    const target = todos.find(t => t.text.includes(text));
    if (!target) return null;
    db.prepare('DELETE FROM todos WHERE id = ?').run(target.id);
    return target.text;
}


// GPT 프롬프트 생성
function buildPrompt(todos) {
    const todoList = todos.length > 0
        ? todos.map((t, i) => `${i + 1}. ${t.text} [${t.completed ? "완료됨" : "미완료"}]`).join('\n')
        : '할 일이 없습니다.';

    return `
당신은 사용자의 To-Do 목록을 도와주는 비서입니다.
아래는 현재 사용자의 할 일 목록입니다.

${todoList}

사용자는 다음과 같은 요청을 할 수 있습니다:
- 오늘 할 일이 뭐야?
- 새로운 할 일을 추가해줘
- 어떤 할 일을 삭제해줘
- 어떤 할 일을 완료 처리해줘
- 전체 요약해줘

반드시 아래 형식으로 JSON으로 응답해 주세요:
{
  "action": "summary" | "add" | "delete" | "done" | "list",
  "text": "요약 텍스트나 추가/삭제할 내용"
}
`;
}

function buildPrompt2(todos) {
    const todoList = todos.length > 0
        ? todos.map((t, i) => `${i + 1}. ${t.text} [${t.completed ? "완료됨" : "미완료"}]`).join('\n')
        : '할 일이 없습니다.';

    return `
당신은 To-Do 목록을 도와주는 비서입니다. 사용자의 질문을 이해하고 아래 예시처럼 응답하세요.

아래는 사용자의 현재 할 일 목록입니다:

${todoList}

[규칙]
- 사용자가 할 일을 "추가"하면 action은 "add"
- 특정 할 일을 "완료 처리"하면 action은 "done"
- 사용자가 할 일을 "삭제"하려고 할 경우에만 action은 "delete"
- 전체 목록을 보여달라고 하면 action은 "list"
- 요약해달라고 하면 action은 "summary"
- 응답은 반드시 JSON 형식으로 응답하며, 아래 형식과 예시를 따릅니다

[출력 형식]
{
  "action": "add" | "done" | "delete" | "list" | "summary",
  "text": "내용"
}

[예시]
질문: "회의 준비 추가해줘"
응답:
{
  "action": "add",
  "text": "회의 준비"
}

질문: "회의 준비 완료했어"
응답:
{
  "action": "done",
  "text": "회의 준비"
}

질문: "회의 준비 삭제해줘"
응답:
{
  "action": "delete",
  "text": "회의 준비"
}

질문: "파이썬 숙제를 추가해줘"
응답:
{
  "action": "done",
  "text": "파이썬 숙제"
}

질문: "숙제를 다했어"
응답:
{
  "action": "done",
  "text": "숙제"
}

질문: "지금 남은 할 일 보여줘"
응답:
{
  "action": "list",
  "text": ""
}

질문: "할 일 요약해줘"
응답:
{
  "action": "summary",
  "text": ""
}

반드시 위 예시와 동일한 JSON 형식으로만 응답하세요.
마크다운 표시(예: \\\)는 절대 사용하지 마세요.
`;
}

function buildSummaryPrompt(doneList, undoneList) {
    const doneStr = doneList.length > 0
        ? doneList.map(t => `- ${t.text}`).join('\n')
        : '없음';

    const undoneStr = undoneList.length > 0
        ? undoneList.map(t => `- ${t.text}`).join('\n')
        : '없음';

    return `
당신은 사용자의 하루를 요약해주는 비서입니다.

[완료한 일]
${doneStr}

[아직 남은 일]
${undoneStr}

위 내용을 참고하여 오늘의 할 일 상황을 요약해 주세요.
- 자연어 문장으로 요약해 주세요.
- 완료한 일과 남은 일 모두 언급해 주세요.
- 2~4문장 이내로 요약해 주세요.
- 마크다운이나 코드 블록은 절대 사용하지 마세요.
`;
}

async function requestChatGPT(systemPrompt, userInput) {
    console.log('질문:', userInput);
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userInput }
        ],
        temperature: 0.2
    });

    let content = response.choices[0].message.content.trim();
    content = content.replace(/^```json\s*|\s*```$/g, '').trim();
    console.log('GPT 응답:', content);

    return content;
}

module.exports = router;
