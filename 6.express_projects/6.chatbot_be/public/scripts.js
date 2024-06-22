document.addEventListener("DOMContentLoaded", function() {
    const chatbotIcon = document.getElementById('chatbotIcon');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const closeChatbot = document.getElementById('closeChatbot');
    const sendMessage = document.getElementById('sendMessage');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const userId = Date.now();  // Unique user ID based on timestamp

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
            const messageElement = document.createElement('div');
            messageElement.classList.add('chat-message');
            messageElement.classList.add('user');
            messageElement.textContent = message;
            chatbotMessages.appendChild(messageElement);
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
        }
    });

    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage.click();
        }
    });

    // Fetch new messages from server
    function fetchMessages() {
        fetch(`/api/admin/messages?userId=${userId}`)
            .then(response => response.json())
            .then(messages => {
                chatbotMessages.innerHTML = ''; // Clear the existing messages
                messages.forEach(msg => {
                    const messageElement = document.createElement('div');
                    messageElement.classList.add('chat-message');
                    if (msg.fromAdmin) {
                        messageElement.classList.add('admin');
                    } else {
                        messageElement.classList.add('user');
                    }
                    messageElement.textContent = msg.text;
                    chatbotMessages.appendChild(messageElement);
                });
            })
            .catch(error => {
                console.error('Error fetching messages:', error);
            });
    }

    // Fetch messages every 5 seconds
    setInterval(fetchMessages, 5000);
    fetchMessages(); // Initial fetch
});
