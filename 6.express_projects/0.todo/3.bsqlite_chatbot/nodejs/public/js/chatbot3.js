// const API_SERVER = 'http://localhost:3000'; // API 서버 주소를 상수로 정의
const API_SERVER = '';

document.addEventListener("DOMContentLoaded", function() {
    // chatbot UI 렌더링
    createChatbotUI();

    // DOMContentLoaded 이벤트가 발생하면 콜백 함수 실행
    const chatbotIcon = document.getElementById('chatbotIcon'); // 챗봇 아이콘 요소 선택
    const chatbotWindow = document.getElementById('chatbotWindow'); // 챗봇 창 요소 선택
    const closeChatbot = document.getElementById('closeChatbot'); // 챗봇 창 닫기 버튼 요소 선택
    const sendMessage = document.getElementById('sendMessage'); // 메시지 보내기 버튼 요소 선택
    const chatbotMessages = document.getElementById('chatbotMessages'); // 메시지 창 요소 선택
    const chatbotInput = document.getElementById('chatbotInput'); // 메시지 입력창 요소 선택

    // 챗봇 아이콘을 클릭했을 때 실행되는 함수
    chatbotIcon.addEventListener('click', function() {
        chatbotIcon.style.display = 'none'; // 챗봇 아이콘 숨기기
        chatbotWindow.style.display = 'flex'; // 챗봇 창 보이기
    });

    // 챗봇 창 닫기 버튼을 클릭했을 때 실행되는 함수
    closeChatbot.addEventListener('click', function() {
        chatbotWindow.style.display = 'none'; // 챗봇 창 숨기기
        chatbotIcon.style.display = 'flex'; // 챗봇 아이콘 보이기
    });

    function addMessage(message, sender = 'user') {
        const messageElement = document.createElement('div'); // 새로운 div 요소 생성
        const formattedMessage = message.replace(/\n/g, '<br>'); // 줄바꿈 추가

        // messageElement.textContent = message; // div 요소에 메시지 텍스트 설정
        // messageElement.textContent = sender === 'user' ? `👤: ${message}` : `🤖: ${message}`;
        messageElement.innerHTML = sender === 'user'
            ? `<i class="bi bi-person"></i> ${formattedMessage}`
            : `<i class="bi bi-robot"></i> ${formattedMessage}`;
        messageElement.classList.add(sender); // CSS 디자인 추가
        chatbotMessages.appendChild(messageElement); // 메시지 창에 div 요소 추가
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // 스크롤을 맨 아래로 이동
    }

    // 메시지 보내기 버튼을 클릭했을 때 실행되는 함수
    sendMessage.addEventListener('click', handleUserMessage);

    // 입력창에서 키보드 엔터키를 눌렀을 때 실행되는 함수
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') { // 엔터키가 눌렸을 때
            // sendMessage.click(); // 메시지 보내기 버튼 클릭
            handleUserMessage();
        }
    });

    /**
     * 메시지 전송 처리 (기본적으로 일반 비스트리밍)
     */
    async function handleUserMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            chatbotInput.value = '';

            // 일반 요청 (기본)
            const botResponse = await sendMessageToServer(message);
            addMessage(botResponse, 'bot');

            // 응답 받은 뒤 화면 갱신 - 주의: 다른 모듈의 함수
            fetchTodos();
        }
    }

    /**
     * 일반 비스트리밍 요청 처리
     */
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

    // 화면 맨 끝에 아래 코드 삽입
    function createChatbotUI() {
        const chatbotHTML = `
            <div class="chatbot-icon" id="chatbotIcon">
                <i class="bi bi-chat-dots-fill"></i>
            </div>
            <div class="chatbot-window" id="chatbotWindow" style="display: none;">
                <div class="resizer" id="resizer"></div>
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
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    // 챗봇 윈도우 리사이즈
    const resizer = document.getElementById('resizer');

    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    resizer.addEventListener('mousedown', function (e) {
        e.preventDefault();
        isResizing = true;

        startX = e.clientX;
        startY = e.clientY;

        const rect = chatbotWindow.getBoundingClientRect();
        startWidth = rect.width;
        startHeight = rect.height;
    });

    document.addEventListener('mousemove', function (e) {
        if (!isResizing) return;

        const dx = startX - e.clientX;  // 왼쪽 방향 드래그
        const dy = startY - e.clientY;  // 위쪽 방향 드래그

        const newWidth = Math.max(250, startWidth + dx);
        const newHeight = Math.max(300, startHeight + dy);

        chatbotWindow.style.width = newWidth + 'px';
        chatbotWindow.style.height = newHeight + 'px';
    });

    document.addEventListener('mouseup', function () {
        isResizing = false;
    });

});
