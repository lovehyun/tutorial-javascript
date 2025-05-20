const API_SERVER = 'http://localhost:3000'; // API 서버 주소를 상수로 정의

document.addEventListener("DOMContentLoaded", function() {
    // 챗봇 관련 HTML 요소들을 동적으로 생성합니다.
    const body = document.body;

    // 챗봇 아이콘
    const chatbotIcon = document.createElement('div');
    chatbotIcon.classList.add('chatbot-icon');
    chatbotIcon.innerHTML = '<i class="bi bi-chat-dots-fill"></i>';
    body.appendChild(chatbotIcon);

    // 챗봇 창
    const chatbotWindow = document.createElement('div');
    chatbotWindow.classList.add('chatbot-window');
    chatbotWindow.style.display = 'none'; // 초기에는 숨겨두기
    chatbotWindow.innerHTML = `
        <div class="chatbot-header">
            <span>Chatbot</span>
            <button id="closeChatbot">X</button>
        </div>
        <div class="chatbot-body">
            <div class="chatbot-messages" id="chatbotMessages"></div>
            <div class="chatbot-input-container">
                <input type="text" id="chatbotInput" placeholder="Type a message...">
                <button id="sendMessage">Send</button>
            </div>
        </div>
    `;
    body.appendChild(chatbotWindow);

    const closeChatbot = document.getElementById('closeChatbot');
    const sendMessage = document.getElementById('sendMessage');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');

    // 챗봇 아이콘 클릭
    chatbotIcon.addEventListener('click', function() {
        chatbotIcon.style.display = 'none'; // 챗봇 아이콘 숨기기
        chatbotWindow.style.display = 'flex'; // 챗봇 창 보이기
    });

    // 챗봇 창 닫기 버튼 클릭
    closeChatbot.addEventListener('click', function() {
        chatbotWindow.style.display = 'none'; // 챗봇 창 숨기기
        chatbotIcon.style.display = 'flex'; // 챗봇 아이콘 보이기
    });

    function addMessage(message, sender = 'user') {
        const messageElement = document.createElement('div');
        const formattedMessage = message.replace(/\n/g, '<br>'); // 줄바꿈 처리

        messageElement.innerHTML = sender === 'user'
            ? `<i class="bi bi-person"></i> ${formattedMessage}`
            : `<i class="bi bi-robot"></i> ${formattedMessage}`;
        messageElement.classList.add(sender); // CSS 디자인 추가
        chatbotMessages.appendChild(messageElement); // 메시지 창에 추가
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // 스크롤 맨 아래로
    }

    // 메시지 보내기 버튼 클릭
    sendMessage.addEventListener('click', handleUserMessage);

    // 입력창에서 엔터키 지원
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });

    // 메시지 수신 처리 
    async function handleUserMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            chatbotInput.value = '';

            // 서버에 메시지 전송
            const botResponse = await sendMessageToServer(message);
            addMessage(botResponse, 'bot');
        }
    }

    // 서버로 메세지 전송
    async function sendMessageToServer(question) {
        try {
            const response = await fetch(`${API_SERVER}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question })
            });
            const data = await response.json();
            return data.answer;
        } catch (error) {
            console.error('서버와의 연결 오류:', error);
            return '서버와 연결할 수 없습니다.';
        }
    }
});
