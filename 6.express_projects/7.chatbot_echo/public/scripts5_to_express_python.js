const API_SERVER = 'http://localhost:3000'; // API 서버 주소를 상수로 정의

document.addEventListener("DOMContentLoaded", function() {
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
        // messageElement.textContent = message; // div 요소에 메시지 텍스트 설정
        // messageElement.textContent = sender === 'user' ? `👤: ${message}` : `🤖: ${message}`;
        messageElement.innerHTML = sender === 'user'
            ? `<i class="bi bi-person"></i> ${message}`
            : `<i class="bi bi-robot"></i> ${message}`;
        messageElement.classList.add(sender); // CSS 디자인 추가
        chatbotMessages.appendChild(messageElement); // 메시지 창에 div 요소 추가
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // 스크롤을 맨 아래로 이동
    }

    function addImage(imageUrl) {
        const imageElement = document.createElement('div');
        imageElement.classList.add('bot');
        // imageElement.innerHTML = `<img src="${imageUrl}" style="max-width: 100%; border-radius: 8px; margin-top: 6px;">`;
        imageElement.innerHTML = `
            <img src="${imageUrl}" 
                style="max-width: 100%; border-radius: 8px; margin-top: 6px; cursor: pointer;"
                onclick="window.open('${imageUrl}', '_blank')">
            </img>
        `
        chatbotMessages.appendChild(imageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
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
            const response = await sendMessageToServer(message);
            console.log(response);
            if (response.type === 'text') {
                addMessage(response.content, 'bot');
            } else if (response.type === 'image') {
                addImage(response.content);
            } else {
                addMessage('[오류] 응답을 이해하지 못했습니다.', 'bot');
            }
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
            if (data.response_type === 'text') {
                return { type: 'text', content: data.answer };
            } else if (data.response_type === 'image') {
                return { type: 'image', content: data.image_url };
            } else {
                return { type: 'text', content: '[⚠️ 알 수 없는 응답 형식]' };
            }
        } catch (error) {
            console.error('서버와의 연결 오류:', error);
            return { type: 'text', content: '❌ 서버와 연결할 수 없습니다.' };
        }
    }
});
