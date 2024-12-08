document.getElementById('crawlForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const url = document.getElementById('urlInput').value;
    const maxDepth = document.getElementById('depthInput').value;
    const clientId = Date.now(); // 고유 클라이언트 ID 생성

    const queueList = document.getElementById('queueList');
    const completedList = document.getElementById('completedList');
    queueList.innerHTML = '';
    completedList.innerHTML = '';

    try {
        await fetch('/api/crawl', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, maxDepth, clientId }),
        });

        const eventSource = new EventSource('/events');
        eventSource.onopen = () => console.log('[SSE] Connection opened');
        eventSource.onerror = () => console.error('[SSE] Connection error');
        
        // 대기열 업데이트
        eventSource.addEventListener('queue', (e) => {
            const data = JSON.parse(e.data);
            queueList.innerHTML = ''; // 기존 내용 초기화
            data.queue.forEach(queueUrl => {
                const listItem = document.createElement('li');
                listItem.textContent = queueUrl;
                queueList.appendChild(listItem);
            });
        });

        // 완료된 URL 업데이트
        eventSource.addEventListener('done', (e) => {
            const data = JSON.parse(e.data);
            const listItem = document.createElement('li');
            if (data.title) {
                listItem.innerHTML = `<span class="highlight-title">${data.title}</span> - ${data.url}`;
            } else {
                listItem.textContent = data.url;
            }
            completedList.appendChild(listItem);
        });
    } catch (err) {
        console.error('Error starting crawl:', err);
    }
});
