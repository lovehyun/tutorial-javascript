const questionInput = document.getElementById('questionInput');
const sendButton = document.getElementById('sendButton');
const chatContainer = document.getElementById('chatContainer');

// 메시지 추가 함수
function addMessage(content, isUser = true) {
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
        <div>${content}</div>
    `;

    // 초기 메시지 제거
    const initialMessage = chatContainer.querySelector('.text-center');
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
    sendButton.innerHTML = '전송 중...';

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
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
        sendButton.innerHTML = '전송';
    }
}

// 이벤트 리스너 추가
sendButton.addEventListener('click', sendMessage);
questionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});