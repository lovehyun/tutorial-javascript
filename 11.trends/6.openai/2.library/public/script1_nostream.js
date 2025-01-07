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
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question })
        });

        const data = await response.json();
        
        if (data.answer) {
            addMessage(data.answer, false);
        } else {
            addMessage('죄송합니다. 응답을 생성하는 데 문제가 발생했습니다.', false);
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
