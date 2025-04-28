// (사용자 질문) "오늘 일정은?" 
//   ↓
// (analyzeQuestion) → { type: "today" }
//   ↓
// (chatbot.js) → 오늘 날짜로 DB 조회
//   ↓
// (generateAnswer) → "오늘은 일정이 없습니다." or "오늘 일정은 3건 있습니다..." 
//   ↓
// (응답) → { answer: "..." }

import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// OpenAI 객체 생성
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// 1. 사용자 질문 분석 (today, month, tomorrow 등)
export async function analyzeQuestion(question) {
    const res = await openai.chat.completions.create({
        model: 'gpt-4-turbo', // 모델 변경
        response_format: { type: 'json_object' }, // JSON 포맷 강제
        messages: [
            {
                role: 'system',
                content: `
당신은 일정 관리 챗봇입니다.

사용자의 질문을 이해하고 반드시 아래 중 하나를 **JSON 형식**으로만 답하세요.
다른 말은 절대 하지 마세요. 죄송합니다/잘 모르겠습니다 같은 문장도 금지입니다.

가능한 답변은 다음과 같습니다:
- { "type": "today" }
- { "type": "month" }
- { "type": "tomorrow" }

"오늘 일정 알려줘" = { "type": "today" }
"이번달 스케줄 보여줘" = { "type": "month" }
"내일 약속 뭐 있어?" = { "type": "tomorrow" }

무조건 위 3가지 중 하나로 JSON 오브젝트를 출력하세요.
설명 문장 추가 금지, 다른 문장 출력 금지.
`
            },
            { role: 'user', content: question }
        ]
    });

    try {
        const text = res.choices[0].message.content.trim();
        return JSON.parse(text);
    } catch (e) {
        console.error('질문 분석 실패:', e);
        return { type: 'unknown' };
    }
}

// 2. 일정 데이터를 자연어로 포장
export async function generateAnswer(scheduleData, dateType = 'today') {
    if (scheduleData.length === 0) {
        return dateType === 'today' ? '오늘은 일정이 없습니다.' : '이번 달은 일정이 없습니다.';
    }

    let listText = '';

    // 날짜별 그룹핑
    const grouped = {};
    scheduleData.forEach((r) => {
        if (!grouped[r.date]) grouped[r.date] = [];
        grouped[r.date].push(r);
    });

    for (const date in grouped) {
        listText += `${date}:\n`;
        grouped[date].forEach((r, idx) => {
            listText += `${idx + 1}. ${r.title}: ${r.description || ''}\n`;
        });
        listText += '\n';
    }

    const prompt = `다음은 사용자 일정 목록입니다. 자연스럽게 대답해줘.\n\n${listText}`;
    console.log("최종 응답생성요청: ", prompt);

    const res = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
            { role: 'system', content: '당신은 친절한 일정 관리 비서입니다.' },
            { role: 'user', content: prompt }
        ]
    });

    const response = res.choices[0].message.content.trim();
    console.log("최종 응답: ", response);

    return response;
}
