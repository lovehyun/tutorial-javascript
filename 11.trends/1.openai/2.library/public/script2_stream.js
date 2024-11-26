const questionInput = document.getElementById('questionInput');
const sendButton = document.getElementById('sendButton');
const chatContainer = document.getElementById('chatContainer');

// 메시지 추가 함수
function addMessage(content, isUser = true, isStreaming = false) {
    // 초기 메시지 제거
    const initialMessage = chatContainer.querySelector('.text-center');
    if (initialMessage) {
        initialMessage.remove();
    }

    const messageDiv = document.createElement('div');
    
    // 개별 클래스로 분리
    messageDiv.classList.add('p-3', 'rounded-lg', 'max-w-[80%]');
    
    if (isUser) {
        messageDiv.classList.add('bg-blue-100', 'text-blue-800', 'self-end');
    } else {
        messageDiv.classList.add('bg-gray-100', 'text-gray-800', 'self-start');
    }
    
    messageDiv.innerHTML = `
        <div class="font-semibold mb-1">${isUser ? '사용자' : 'AI 챗봇'}</div>
        <div class="${isStreaming ? 'animate-pulse' : ''}">${content}</div>
    `;

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
    sendButton.innerHTML = '전송 중...';

    try {
        // AI 응답 메시지 준비 (스트리밍용)
        const aiMessageElement = addMessage('', false, true);
        const aiMessageContentElement = aiMessageElement.querySelector('div:last-child');

        // 스트리밍 처리
        const response = await fetch('/api/chat-stream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question })
        });

        // EventSource 대신 fetch의 ReadableStream 사용
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        // 스트리밍 완료 여부를 추적하는 변수 추가
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

        // 스트리밍 종료 후 유니크 식별자로 요소를 다시 가져와 애니메이션 제거
        const aiLatestMessageContentElement = aiMessageElement.querySelector('div:last-child');
        if (aiLatestMessageContentElement) {
            aiLatestMessageContentElement.classList.remove('animate-pulse');
        }

    } catch (error) {
        console.error('Error:', error);
        addMessage('네트워크 오류가 발생했습니다.', false);
    } finally {
        sendButton.disabled = false;
        sendButton.innerHTML = '전송';
    }
}

// 이벤트 리스너 추가
sendButton.addEventListener('click', sendMessage);
questionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
