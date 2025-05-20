// 팁: 개발자도구에서 한번에 로딩
// 
// 챗봇 백엔드 통신용 API서버 주소 설정
// window.CHATBOT_CONFIG = {
//   API_SERVER: 'https://your-api-server.com'
// };
// 
// (async () => {
//   const script = document.createElement('script');
//   script.src = 'https://domain/path/chatbot.js';
//   script.defer = true;
//   document.head.appendChild(script);
// })();

// 챗봇 UI를 생성하는 함수
function createChatbotUI() {
    // 챗봇 아이콘
    const chatbotIcon = document.createElement('div');
    chatbotIcon.id = 'chatbotIcon';
    chatbotIcon.classList.add('chatbot-icon');
    chatbotIcon.innerHTML = '<i class="bi bi-chat-dots-fill"></i>';

    // 챗봇 창
    const chatbotWindow = document.createElement('div');
    chatbotWindow.id = 'chatbotWindow';
    chatbotWindow.classList.add('chatbot-window');
    chatbotWindow.style.display = 'none'; // 처음에는 숨김 처리

    // 챗봇 헤더
    const header = document.createElement('div');
    header.classList.add('chatbot-header');
    header.innerHTML = `<span>Chatbot</span><button id="closeChatbot">X</button>`;

    // 챗봇 바디
    const body = document.createElement('div');
    body.classList.add('chatbot-body');

    const messages = document.createElement('div');
    messages.id = 'chatbotMessages';
    messages.classList.add('chatbot-messages');

    const inputContainer = document.createElement('div');
    inputContainer.classList.add('chatbot-input-container');
    inputContainer.innerHTML = `
        <input type="text" id="chatbotInput" placeholder="Type a message...">
        <button id="sendMessage">Send</button>
    `;

    body.appendChild(messages);
    body.appendChild(inputContainer);

    chatbotWindow.appendChild(header);
    chatbotWindow.appendChild(body);

    // body의 맨 마지막에 아이콘과 창 추가
    document.body.appendChild(chatbotIcon);
    document.body.appendChild(chatbotWindow);

    return { chatbotIcon, chatbotWindow, messages };
}

// 필요 스타일이 없으면 자동으로 추가
function loadChatbotStylesheet() {
    const existingLink = document.querySelector('link[href*="chatbot.css"]');
    if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/chatbot.css';  // 실제 배포된 CSS 경로 (https://xxx)
        document.head.appendChild(link);
    }

    // bootstrap-icons도 없으면 추가
    const iconLink = document.querySelector('link[href*="bootstrap-icons"]');
    if (!iconLink) {
        const bi = document.createElement('link');
        bi.rel = 'stylesheet';
        bi.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css';
        document.head.appendChild(bi);
    }
}

// 챗봇 초기화 함수
function initChatbot() {
    const API_SERVER = window.CHATBOT_CONFIG?.API_SERVER || 'http://localhost:3000';
    const { chatbotIcon, chatbotWindow, messages } = createChatbotUI();

    const closeChatbot = document.getElementById('closeChatbot');
    const sendMessage = document.getElementById('sendMessage');
    const chatbotInput = document.getElementById('chatbotInput');

    // 이벤트 리스너: 챗봇 아이콘 클릭 시 챗봇 창 보이기
    chatbotIcon.addEventListener('click', () => {
        chatbotIcon.style.display = 'none';
        chatbotWindow.style.display = 'flex';
    });

    // 이벤트 리스너: 챗봇 창 닫기 버튼 클릭 시
    closeChatbot.addEventListener('click', () => {
        chatbotWindow.style.display = 'none';
        chatbotIcon.style.display = 'flex';
    });

    // 메시지 추가 함수
    function addMessage(message, sender = 'user') {
        const messageElement = document.createElement('div');
        const formattedMessage = message.replace(/\n/g, '<br>');
        messageElement.innerHTML = sender === 'user'
            ? `<i class="bi bi-person"></i> ${formattedMessage}`
            : `<i class="bi bi-robot"></i> ${formattedMessage}`;
        messageElement.classList.add(sender);
        messages.appendChild(messageElement);
        messages.scrollTop = messages.scrollHeight;
    }

    // 메시지 보내기 처리 함수
    async function handleUserMessage() {
        const message = chatbotInput.value.trim();
        if (!message) return;
        addMessage(message, 'user');
        chatbotInput.value = '';
        const botResponse = await sendMessageToServer(message);
        addMessage(botResponse, 'bot');
    }

    // 서버로 메시지 전송하는 함수
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

    // 이벤트 리스너: 메시지 전송 버튼
    sendMessage.addEventListener('click', handleUserMessage);
    // 이벤트 리스너: 엔터키 입력 시
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });
}

// DOMContentLoaded 이벤트 후 챗봇 초기화
document.addEventListener("DOMContentLoaded", () => {
    loadChatbotStylesheet();
    initChatbot();
});
