let selectedUserId = null;

// Fetch messages and populate user list
function fetchMessages() {
    fetch('/api/admin/messages')
        .then(response => response.json())
        .then(messages => {
            const userList = document.getElementById('userList');
            const users = {};

            // Group messages by userId
            messages.forEach(msg => {
                if (!users[msg.userId]) {
                    users[msg.userId] = [];
                }
                users[msg.userId].push(msg);
            });

            // Populate user list
            userList.innerHTML = ''; // Clear the existing list
            for (const userId in users) {
                const userItem = document.createElement('div');
                userItem.textContent = `User ${userId}`;
                userItem.classList.add('user-list-item');
                userItem.dataset.userId = userId;
                userItem.addEventListener('click', () => {
                    selectedUserId = userId;
                    displayMessages(users[userId]);
                });
                userList.appendChild(userItem);
            }

            // If a user is selected, refresh their messages
            if (selectedUserId && users[selectedUserId]) {
                displayMessages(users[selectedUserId]);
            }
        });
}

function displayMessages(messages) {
    const chatMessages = document.getElementById('chatMessages');
    const chatHeader = document.getElementById('chatHeader');
    chatMessages.innerHTML = '';
    chatHeader.textContent = `Messages for User ${selectedUserId}`;

    messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');
        if (msg.fromAdmin) {
            messageElement.classList.add('admin');
        } else {
            messageElement.classList.add('user');
        }
        messageElement.textContent = `[${new Date(msg.timestamp).toLocaleTimeString()}] ${msg.text}`;
        chatMessages.appendChild(messageElement);
    });

    // 스크롤을 최하단으로 설정
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

document.getElementById('sendResponse').addEventListener('click', function() {
    const adminInput = document.getElementById('adminInput');
    const message = adminInput.value.trim();
    if (message && selectedUserId) {
        // Send response to server
        fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                userId: selectedUserId, 
                message, 
                timestamp: new Date(), 
                fromAdmin: true,
                author: 'WebAdmin' // Set author to WebAdmin
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response sent:', data);
            adminInput.value = '';
            fetchMessages(); // Refresh messages
        })
        .catch(error => {
            console.error('Error sending response:', error);
        });
    }
});

document.getElementById('adminInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('sendResponse').click();
    }
});


// Fetch messages every 5 seconds
setInterval(fetchMessages, 5000);
fetchMessages(); // Initial fetch
