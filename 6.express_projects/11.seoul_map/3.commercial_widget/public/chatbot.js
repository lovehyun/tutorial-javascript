document.addEventListener("DOMContentLoaded", function() {
    const chatbotIcon = document.getElementById('chatbotIcon');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const closeChatbot = document.getElementById('closeChatbot');
    const sendMessage = document.getElementById('sendMessage');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const regionSelector = document.getElementById('region-selector');

    // 챗봇 초기화 함수
    function initChatbot() {
        // 헤더 타이틀 설정
        document.querySelector('.chatbot-header span:first-child').textContent = '지도 도우미';
        
        // 초기 인사 메시지 추가
        addMessage('안녕하세요! 지도 이용을 도와드릴게요. "서울", "제주", "줌인", "줌아웃" 등의 명령어를 입력해보세요.', 'bot');
    }

    // 명령어 처리 함수
    const commandHandlers = {
        '서울': () => {
            regionSelector.value = 'seoul';
            const changeEvent = new Event('change');
            regionSelector.dispatchEvent(changeEvent);
            return '서울특별시로 지도를 변경했습니다.';
        },
        '제주': () => {
            regionSelector.value = 'jeju';
            const changeEvent = new Event('change');
            regionSelector.dispatchEvent(changeEvent);
            return '제주특별자치도로 지도를 변경했습니다.';
        },
        '줌인': () => {
            const currentZoom = map.getZoom();
            map.setZoom(currentZoom + 1);
            return `지도를 확대했습니다.<br>(줌 레벨: ${currentZoom + 1})`;
        },
        '줌아웃': () => {
            const currentZoom = map.getZoom();
            map.setZoom(currentZoom - 1);
            return `지도를 축소했습니다.<br>(줌 레벨: ${currentZoom - 1})`;
        },
        '도움말': () => {
            return `사용 가능한 명령어:<br>
            - 서울: 서울특별시 지도로 변경<br>
            - 제주: 제주특별자치도 지도로 변경<br>
            - 줌인: 지도 확대하기<br>
            - 줌아웃: 지도 축소하기<br>
            - 도움말: 사용 가능한 명령어 보기`;
        }
    };

    // 챗봇 UI 제어
    chatbotIcon.addEventListener('click', () => {
        chatbotIcon.style.display = 'none';
        chatbotWindow.style.display = 'flex';
    });

    closeChatbot.addEventListener('click', () => {
        chatbotWindow.style.display = 'none';
        chatbotIcon.style.display = 'flex';
    });

    sendMessage.addEventListener('click', handleUserMessage);
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleUserMessage();
    });

    // 초기화 함수 호출
    initChatbot();

    function addMessage(message, sender = 'user') {
        const messageElement = document.createElement('div');
        const iconClass = sender === 'user' ? 'bi-person' : 'bi-robot';
        messageElement.innerHTML = `<i class="bi ${iconClass}"></i> ${message}`;
        messageElement.classList.add(sender);
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function processCommand(message) {
        // 명령어 처리
        message = message.trim().toLowerCase();
        
        // 정확히 일치하는 명령어 먼저 확인
        if (commandHandlers[message]) {
            return commandHandlers[message]();
        }
        
        // 포함된 명령어 확인
        for (const [cmd, handler] of Object.entries(commandHandlers)) {
            if (message.includes(cmd)) {
                return handler();
            }
        }
        
        // 명령어가 없는 경우
        return '죄송합니다. 이해하지 못했습니다. "도움말"을 입력하면 사용 가능한 명령어를 볼 수 있습니다.';
    }

    function handleUserMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            chatbotInput.value = '';

            // 명령어 처리
            const botResponse = processCommand(message);
            addMessage(botResponse, 'bot');
        }
    }
});
