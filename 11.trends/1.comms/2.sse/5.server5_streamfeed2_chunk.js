// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// 정적 파일 제공 (프론트 HTML)
app.use(express.static(path.join(__dirname, 'public')));

// 하드코딩된 뉴스 기사 목록 (긴 문장 여러 개)
const newsFeed = [
    {
        title: 'AI 기반 개인 업무비서 서비스 상용화 임박',
        content:
            '생성형 AI를 활용한 개인 업무비서 서비스가 조만간 상용화될 전망입니다. ' +
            '이번 서비스는 이메일 정리, 일정 관리, 회의록 요약 뿐 아니라, 영수증 정리와 세무 관련 문서까지 자동으로 분류해주는 기능을 탑재했습니다.',
    },
    {
        title: '국내 스타트업, 멀티모달 AI로 글로벌 시장 도전',
        content:
            '국내 한 스타트업이 이미지·음성·텍스트를 동시에 이해하는 멀티모달 AI 기술을 앞세워 ' +
            '글로벌 시장에 도전장을 내밀었습니다. 사용자는 사진을 찍거나 음성으로 설명하는 것만으로도 ' +
            '계약서 검토, 법률 문서 요약, 회계 자료 분석 등의 복잡한 업무를 손쉽게 처리할 수 있게 됩니다.',
    },
    {
        title: '보안 업계, AI 기반 공격·방어 에이전트 경쟁 치열',
        content:
            '보안 업계에서는 AI 에이전트를 활용한 공격·방어 시뮬레이션 기술 경쟁이 치열해지고 있습니다. ' +
            '공격 에이전트는 실제 해킹 시나리오를 자동으로 생성하고, 방어 에이전트는 실시간으로 이를 탐지하고 차단하는 전략을 학습합니다. ' +
            '이를 통해 기업들은 보다 현실적인 모의 침투 테스트와 대응 전략 수립이 가능해질 전망입니다.',
    },
    {
        title: '클라우드 인프라 비용 최적화, 중소기업의 새로운 과제',
        content:
            '중소기업들이 AI 서비스를 적극적으로 도입하면서, 클라우드 인프라 비용 최적화가 중요한 과제로 떠오르고 있습니다. ' +
            '전문가들은 서버리스 아키텍처, 스팟 인스턴스 활용, 스토리지 계층 분리 등을 통해 비용을 절감할 수 있다고 조언합니다. ' +
            '또한 모니터링과 자동 스케일링 정책을 함께 설계하는 것이 핵심이라고 강조합니다.',
    },
];

// 문자열을 단어/토큰 단위로 잘라서 chunk 배열로 만드는 헬퍼
function chunkText(text, chunkSize = 10) {
    const words = text.split(/\s+/);
    const chunks = [];
    for (let i = 0; i < words.length; i += chunkSize) {
        chunks.push(words.slice(i, i + chunkSize).join(' '));
    }
    return chunks;
}

// SSE 엔드포인트: /news-stream
app.get('/news-stream', (req, res) => {
    console.log('🔌 [SSE] 클라이언트 뉴스 스트림 연결됨');

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders && res.flushHeaders();

    // 안내 메시지
    res.write(
        `event: info\ndata: ${JSON.stringify({
            message: '뉴스 스트림에 연결되었습니다. GPT처럼 한 문단씩 스트리밍됩니다.',
        })}\n\n`,
    );

    let newsIndex = 0;          // 몇 번째 뉴스인지
    let chunkIndex = 0;         // 해당 뉴스의 몇 번째 chunk인지
    let currentChunks = [];     // 현재 뉴스의 chunk 배열
    let currentMessageId = 0;   // 말풍선 id (클라이언트에서 하나의 말풍선으로 합치기)
    let timer = null;

    const startNextNews = () => {
        if (newsIndex >= newsFeed.length) {
            // 더 이상 뉴스 없음
            res.write(
                `event: end\ndata: ${JSON.stringify({
                    message: '더 이상 전송할 뉴스가 없습니다.',
                })}\n\n`,
            );
            console.log('✅ [SSE] 모든 뉴스 전송 완료, 연결 종료');
            res.end();
            return;
        }

        const news = newsFeed[newsIndex];
        currentChunks = chunkText(news.content, 8); // 단어 8개씩 잘라서 보냄
        chunkIndex = 0;
        currentMessageId += 1;

        // 타이틀만 먼저 보내는 옵션도 가능하지만
        // 여기서는 첫 chunk에 title 포함해서 보냄
        console.log(`📰 [SSE] 뉴스 시작 index=${newsIndex}, title=${news.title}`);

        // 바로 첫 chunk 전송 시작
        sendNextChunk();
    };

    const sendNextChunk = () => {
        // 클라이언트가 끊었으면 아무것도 안 함
        if (req.aborted) return;

        const news = newsFeed[newsIndex];

        if (chunkIndex >= currentChunks.length) {
            // 이 뉴스는 끝났음 → done 이벤트 한 번 쏘고 다음 뉴스로
            res.write(
                `data: ${JSON.stringify({
                    type: 'done',
                    id: currentMessageId,
                    index: newsIndex,
                    timestamp: new Date().toISOString(),
                })}\n\n`,
            );

            newsIndex += 1;

            // 다음 뉴스는 1초 쉬고 시작
            timer = setTimeout(startNextNews, 1000);
            return;
        }

        const chunk = currentChunks[chunkIndex];

        const payload = {
            type: 'chunk',
            id: currentMessageId,
            index: newsIndex,
            title: chunkIndex === 0 ? news.title : null, // 첫 chunk에만 타이틀 포함
            chunk,
            timestamp: new Date().toISOString(),
        };

        // 기본 event: message 로 전송
        res.write(`data: ${JSON.stringify(payload)}\n\n`);

        chunkIndex += 1;

        // 다음 chunk까지 랜덤 딜레이 (GPT 타이핑 느낌)
        const randomDelay = Math.floor(Math.random() * 600) + 300; // 300~600ms
        timer = setTimeout(sendNextChunk, randomDelay);
    };

    // 첫 뉴스 시작
    startNextNews();

    req.on('close', () => {
        console.log('❌ [SSE] 클라이언트 연결 종료');
        clearTimeout(timer);
    });
});

// 기본 페이지
app.get('/', (req, res) => {
    // 파일 이름은 사용하시는 이름으로 맞추시면 됩니다.
    res.sendFile(path.join(__dirname, 'public', '5.stream2.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`SSE 뉴스 서버 실행 중: http://localhost:${PORT}`);
});
