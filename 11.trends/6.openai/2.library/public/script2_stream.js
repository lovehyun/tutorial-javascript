const questionInput = document.getElementById('questionInput');
const sendButton = document.getElementById('sendButton');
const chatContainer = document.getElementById('chatContainer');

// 메시지 추가 함수
function addMessage(content, isUser = true) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');

    // 메시지 정렬: 사용자 오른쪽, 챗봇 왼쪽
    if (isUser) {
        messageDiv.classList.add('user-message');
    } else {
        messageDiv.classList.add('bot-message');
    }

    messageDiv.innerHTML = `
        <div class="sender">${isUser ? '사용자' : 'AI 챗봇'}</div>
        <div class="content">${content}</div>
    `;

    // 기존 초기 메시지 제거
    const initialMessage = chatContainer.querySelector('.placeholder');
    if (initialMessage) {
        initialMessage.remove();
    }

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    return messageDiv;
}

// 메시지 전송 함수
async function sendMessage() {
    const question = questionInput.value.trim();
    if (!question) return;

    // 사용자 메시지 추가
    addMessage(question);
    questionInput.value = '';
    sendButton.disabled = true;
    sendButton.textContent = '전송 중...';

    try {
        // 간단한 스트리밍 방식 시뮬레이션
        const aiMessageElement = addMessage('응답 생성 중...', false);
        const aiMessageContentElement = aiMessageElement.querySelector('div:last-child');

        // API 요청 (스트리밍 방식)
        const response = await fetch('/api/chat-stream', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';
        let isStreamComplete = false;

        while (!isStreamComplete) {
            const { done, value } = await reader.read();
            
            if (done) {
                isStreamComplete = true;
                break;
            }

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6).trim();
                    
                    if (data === '[DONE]') {
                        isStreamComplete = true;
                        break;
                    }

                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.content) {
                            fullResponse += parsed.content;
                            aiMessageContentElement.textContent = fullResponse;
                            chatContainer.scrollTop = chatContainer.scrollHeight;
                        }
                    } catch (parseError) {
                        console.error('Parsing error:', parseError);
                    }
                }
            }
        }

    } catch (error) {
        console.error('Error:', error);
        addMessage('네트워크 오류가 발생했습니다.', false);
    } finally {
        sendButton.disabled = false;
        sendButton.textContent = '전송';
    }
}

// 이벤트 리스너 추가
sendButton.addEventListener('click', sendMessage);
questionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
