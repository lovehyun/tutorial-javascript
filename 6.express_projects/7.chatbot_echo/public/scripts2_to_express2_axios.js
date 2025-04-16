const API_SERVER = 'http://localhost:3000'; // API 서버 주소

document.addEventListener("DOMContentLoaded", function () {
    const chatbotIcon = document.getElementById('chatbotIcon'); // 챗봇 아이콘 요소 선택
    const chatbotWindow = document.getElementById('chatbotWindow'); // 챗봇 창 요소 선택
    const closeChatbot = document.getElementById('closeChatbot'); // 챗봇 창 닫기 버튼 요소 선택
    const sendMessage = document.getElementById('sendMessage'); // 메시지 보내기 버튼 요소 선택
    const chatbotMessages = document.getElementById('chatbotMessages'); // 메시지 창 요소 선택
    const chatbotInput = document.getElementById('chatbotInput'); // 메시지 입력창 요소 선택

    chatbotIcon.addEventListener('click', function () {
        chatbotIcon.style.display = 'none';
        chatbotWindow.style.display = 'flex';
    });

    closeChatbot.addEventListener('click', function () {
        chatbotWindow.style.display = 'none';
        chatbotIcon.style.display = 'flex';
    });

    function addMessage(message, sender = 'user') {
        const messageElement = document.createElement('div');
        messageElement.innerHTML = sender === 'user'
            ? `<i class="bi bi-person"></i> ${message}`
            : `<i class="bi bi-robot"></i> ${message}`;
        messageElement.classList.add(sender);
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    sendMessage.addEventListener('click', handleUserMessage);

    chatbotInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });

    async function handleUserMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            chatbotInput.value = '';

            // Axios를 사용한 메시지 전송
            const botResponse = await sendMessageToServer(message);
            addMessage(botResponse, 'bot');
        }
    }

    async function sendMessageToServer(question) {
        try {
            const response = await axios.post(`${API_SERVER}/api/chat`, { question });
            return response.data.answer;
        } catch (error) {
            console.error('서버와의 연결 오류:', error);
            return '서버와 연결할 수 없습니다.';
        }
    }
});
