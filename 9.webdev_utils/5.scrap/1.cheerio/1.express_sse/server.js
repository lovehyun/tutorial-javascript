const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const PORT = 3000;

let clients = []; // SSE 연결된 클라이언트 목록
const crawledLinks = new Set();
const crawledLinksDone = new Set();
const queue = []; // 대기열 관리

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// SSE 연결
app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 클라이언트 추가
    clients.push(res);

    req.on('close', () => {
        clients = clients.filter(client => client !== res);
    });
});

// 크롤링 작업
async function crawl(url, depth, maxDepth, clientId) {
    if (depth > maxDepth || crawledLinks.has(url)) {
        return;
    }

    console.log(`[INFO] Depth: ${depth}, URL: ${url}`);
    crawledLinks.add(url);

    // 대기열 업데이트 및 SSE 전송
    queue.push(url);
    sendEvent(clientId, 'queue', { queue });

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // 타이틀 태그 가져오기
        let title = $('title').text() || null;
        if (title) {
            title = title.replace(/\s+/g, ' ').trim(); // 불필요한 공백 제거
        }
        console.log(`[INFO] Fetched Title: ${title} for URL: ${url}`);

        // 페이지의 모든 링크 수집
        const links = [];
        $('a').each((_, element) => {
            const link = $(element).attr('href');
            if (link && link.startsWith('http') && !crawledLinks.has(link)) {
                links.push(link);
            }
        });

        console.log(`[INFO] Found ${links.length} links on ${url}`);

        for (const link of links) {
            if (!crawledLinks.has(link)) {
                console.log(`  [COLLECTED] ${link}`);
                await crawl(link, depth + 1, maxDepth, clientId);
            }
        }

        crawledLinksDone.add(url);
        sendEvent(clientId, 'done', { title, url }); // 완료된 URL과 타이틀 푸시
        console.log(`[INFO] Done crawling: ${url}`);

        // 대기열에서 URL 제거 및 SSE 전송
        queue.splice(queue.indexOf(url), 1);
        sendEvent(clientId, 'queue', { queue });
    } catch (err) {
        console.error(`[ERROR] Failed to fetch ${url}: ${err.message}`);
    }
}

function sendEvent(clientId, type, data) {
    console.log(`[SSE] Sending event: ${type}, Data:`, data);
    clients.forEach(client => {
        client.write(`id: ${clientId}\n`);
        client.write(`event: ${type}\n`);
        client.write(`data: ${JSON.stringify(data)}\n\n`);
    });
}

// REST API: 크롤링 시작
app.post('/api/crawl', async (req, res) => {
    const { url, maxDepth, clientId } = req.body;
    if (!url || maxDepth === undefined || !clientId) {
        return res.status(400).json({ error: 'Missing required parameters: url, maxDepth, clientId' });
    }

    try {
        console.log(`[INFO] Starting crawl for ${url} with maxDepth ${maxDepth}`);
        await crawl(url, 0, maxDepth, clientId);
        res.json({ message: 'Crawling started' });
    } catch (error) {
        console.error(`[ERROR] Failed to start crawling: ${error.message}`);
        res.status(500).json({ error: 'Failed to start crawling' });
    }
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
