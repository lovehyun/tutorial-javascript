const questionInput = document.getElementById('questionInput');
const sendButton = document.getElementById('sendButton');
const chatContainer = document.getElementById('chatContainer');

// 메시지 추가 함수
function addMessage(content, isUser = true, isStreaming = false) {
    // 기존 초기 메시지 제거
    const initialMessage = chatContainer.querySelector('.text-center');
    if (initialMessage) {
        initialMessage.remove();
    }

    const messageDiv = document.createElement('div');
    
    // Tailwind 스타일 적용
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

// 버튼을 비활성화하고 스타일을 변경하는 함수
function disableButton(button) {
    button.disabled = true;
    button.innerHTML = '전송 중...';
    button.classList.add('bg-blue-300', 'cursor-not-allowed');
    button.classList.remove('bg-blue-500');
}

// 버튼을 활성화하고 스타일을 원래대로 되돌리는 함수
function enableButton(button) {
    button.disabled = false;
    button.innerHTML = '전송';
    button.classList.remove('bg-blue-300', 'cursor-not-allowed');
    button.classList.add('bg-blue-500');
}

// GET 방식 스트리밍 메시지 전송
async function sendMessage() {
    const question = questionInput.value.trim();
    if (!question) return;

    // 사용자 메시지 추가
    addMessage(question);
    questionInput.value = '';
    disableButton(sendButton);

    try {
        // EventSource를 사용한 GET 방식 스트리밍 요청
        const eventSource = new EventSource(`/api/chat-stream?question=${encodeURIComponent(question)}`);

        // AI 응답 메시지 준비 (스트리밍용)
        const aiMessageElement = addMessage('', false, true);
        const aiMessageContentElement = aiMessageElement.querySelector('div:last-child');
        let fullResponse = '';

        // 데이터 수신 이벤트 핸들링
        eventSource.onmessage = (event) => {
            if (event.data === '[DONE]') {
                eventSource.close(); // 스트리밍 완료 시 종료
                enableButton(sendButton);
                aiMessageContentElement.classList.remove('animate-pulse');
                return;
            }

            try {
                const parsed = JSON.parse(event.data.replace('data: ', '').trim());
                if (parsed.content) {
                    fullResponse += parsed.content;
                    aiMessageContentElement.textContent = fullResponse;
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }
            } catch (parseError) {
                console.error('데이터 파싱 오류:', parseError);
            }
        };

        // 오류 처리
        eventSource.onerror = (error) => {
            console.error('스트리밍 오류:', error);
            addMessage('서버와의 연결에 문제가 발생했습니다.', false);
            eventSource.close();
            enableButton(sendButton);
        };

    } catch (error) {
        console.error('오류:', error);
        addMessage('네트워크 오류가 발생했습니다.', false);
        enableButton(sendButton);
    }
}

// 이벤트 리스너 추가
sendButton.addEventListener('click', sendMessage);
questionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
