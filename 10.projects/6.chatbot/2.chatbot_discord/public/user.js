document.addEventListener("DOMContentLoaded", function() {
    const chatbotIcon = document.getElementById('chatbotIcon');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const closeChatbot = document.getElementById('closeChatbot');
    const sendMessage = document.getElementById('sendMessage');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const userId = Date.now();  // Unique user ID based on timestamp

    let lastMessageId = 0; // 마지막 메시지 ID를 추적하기 위한 변수

    chatbotIcon.addEventListener('click', function() {
        chatbotIcon.style.display = 'none';
        chatbotWindow.style.display = 'flex';
    });

    closeChatbot.addEventListener('click', function() {
        chatbotWindow.style.display = 'none';
        chatbotIcon.style.display = 'flex';
    });

    sendMessage.addEventListener('click', function() {
        const message = chatbotInput.value.trim();
        if (message) {
            appendMessage(message, false);
            chatbotInput.value = '';

            // Send message to server
            fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, message, timestamp: new Date() })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Message sent:', data);
            })
            .catch(error => {
                console.error('Error sending message:', error);
            });

            // Scroll to the bottom
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
    });

    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage.click();
        }
    });

    function appendMessage(message, fromAdmin, author) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', fromAdmin ? 'admin' : 'user');
    
        // 작성자 이름 표시
        if (author) {
            const authorElement = document.createElement('span');
            authorElement.classList.add('message-author');
            authorElement.textContent = fromAdmin ? `Admin (${author})` : author;
            messageElement.appendChild(authorElement);
        }
        
        // 메시지 내용
        const textElement = document.createElement('div');
        textElement.textContent = message;
        messageElement.appendChild(textElement);
    
        chatbotMessages.appendChild(messageElement);

        // Scroll to the bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    function fetchMessages() {
        fetch(`/api/admin/messages?userId=${userId}`)
            .then((response) => response.json())
            .then((messages) => {
                messages
                    .filter((msg) => msg.id > lastMessageId) // 새 메시지만 처리
                    .forEach((msg) => {
                        appendMessage(msg.text, msg.fromAdmin, msg.author);
                        lastMessageId = msg.id; // 마지막 메시지 ID 업데이트
                    });
            })
            .catch((error) => console.error('Error fetching messages:', error));
    }
        
    const helpButton = document.getElementById('helpButton');

    helpButton.addEventListener('click', function () {
        // 사용자에게 메시지 표시
        appendMessage('도움 요청 중...', false);

        // 서버로 요청 전송
        fetch('/api/help', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                message: '사용자가 도움을 요청하고 있습니다.',
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Help request sent:', data);
                appendMessage('관리자에게 도움 요청을 전송했습니다.', false);
            })
            .catch((error) => {
                console.error('Error sending help request:', error);
                appendMessage('도움 요청 전송에 실패했습니다.', false);
            });
    });

    // Fetch messages every 5 seconds
    setInterval(fetchMessages, 5000);
    fetchMessages(); // Initial fetch
});
