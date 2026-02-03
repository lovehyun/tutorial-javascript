(function () {
    async function fetchTitles(apiKeys) {
        try {
            const response = await fetch('/apikeys/titles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth': localStorage.getItem('token'),
                },
                body: JSON.stringify({ apiKeys }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch API key titles.');
            }

            const data = await response.json();
            console.log('Fetched titles:', data.titles);

            // 유효하지 않은 키 확인 및 콘솔에 출력
            if (data.missingKeys && data.missingKeys.length > 0) {
                console.warn('Invalid API keys:', data.missingKeys);
            }

            return data.titles; // [{ key: 'key1', title: 'Title1' }, ...]
        } catch (error) {
            console.error('Error fetching titles:', error);
            return [];
        }
    }

    async function getApiKeys() {
        const currentScript = document.currentScript || (function () {
            const scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();
        const scriptSrc = currentScript.src;
        const urlParams = new URLSearchParams(scriptSrc.split('?')[1]);
        const apiKeys = [];

        if (urlParams.get('apiKey1')) {
            apiKeys.push(urlParams.get('apiKey1'));
        }
        if (urlParams.get('apiKey2')) {
            apiKeys.push(urlParams.get('apiKey2'));
        }

        console.log('Extracted API keys:', apiKeys);

        // Fetch titles and merge with keys
        const titles = await fetchTitles(apiKeys);
        return apiKeys.map((key, index) => ({
            key,
            title: titles[index]?.title || `Chatbot ${index + 1}`,
            isValid: !!titles[index], // 키가 유효한지 여부
        }));
    }

    (async function () {
        const apiKeys = await getApiKeys();

        if (apiKeys.length === 0) {
            console.error('At least one API key is required');
            return;
        }

        console.log('Chatbot loaded with API keys:', apiKeys);

        // Create chatbot icon
        var chatbotIcon = document.createElement('div');
        chatbotIcon.id = 'chatbot-icon';
        chatbotIcon.innerHTML = `<img src="/client/chatbot-icon-3.svg" alt="Chatbot" style="width: 100%; height: 100%; border-radius: 50%;">`;
        document.body.appendChild(chatbotIcon);

        // Declare chatbotSelection as a variable
        let chatbotSelection;

        // Create chatbot selection popup
        if (apiKeys.length > 1) {
            chatbotSelection = document.createElement('div');
            chatbotSelection.id = 'chatbot-selection';
            chatbotSelection.style.display = 'none';

            const selectionHeader = document.createElement('div');
            selectionHeader.id = 'chatbot-selection-header';
            selectionHeader.textContent = 'Select a Chatbot';
            chatbotSelection.appendChild(selectionHeader);

            apiKeys.forEach((apiKey, index) => {
                const button = document.createElement('button');
                button.className = 'chatbot-option';
                button.textContent = apiKey.title; // Use the title for the button
                button.addEventListener('click', function () {
                    openChatbot(apiKey.title, apiKey.key, index + 1, apiKey.isValid); // Pass title, key, and validity
                });
                chatbotSelection.appendChild(button);
            });

            document.body.appendChild(chatbotSelection);
        }

        // Chatbot container
        const chatbotContainer = document.createElement('div');
        chatbotContainer.id = 'chatbot-container';
        chatbotContainer.style.display = 'none';
        chatbotContainer.innerHTML = `
            <div id="chatbot-header">Chatbot</div>
            <div id="chatbot-messages"></div>
            <div id="chatbot-input-container">
                <input type="text" id="chatbot-input" placeholder="Type a message..."/>
                <button id="chatbot-send">Send</button>
            </div>
        `;
        document.body.appendChild(chatbotContainer);

        let selectedApiKey = null;
        let selectedChatbot = null;

        // Toggle chatbot icon functionality
        chatbotIcon.addEventListener('click', function () {
            if (chatbotContainer.style.display === 'block') {
                // If chat is open, close it
                chatbotContainer.style.display = 'none';
                updateIcon(3); // Reset to default icon (icon 3)
                selectedApiKey = null; // Reset to default key
                selectedChatbot = null;
                console.log('Chatbot closed.');
            } else if (apiKeys.length > 1 && (chatbotSelection.style.display === 'none' || chatbotSelection.style.display === '')) {
                // Open selection popup if there are multiple keys
                chatbotSelection.style.display = 'block';
            } else if (apiKeys.length > 1) {
                // Close selection popup
                chatbotSelection.style.display = 'none';
            } else {
                // Open chat directly for single API key
                openChatbot(apiKeys[0].title, apiKeys[0].key, 1, apiKeys[0].isValid);
            }
        });

        function openChatbot(title, apiKey, iconType, isValid) {
            if (apiKeys.length > 1) document.getElementById('chatbot-selection').style.display = 'none'; // Hide selection if present
            chatbotContainer.style.display = 'block';

            selectedApiKey = apiKey;
            selectedChatbot = title;

            document.getElementById('chatbot-header').textContent = title;
            updateIcon(iconType); // Set icon to the selected chatbot's type
            document.getElementById('chatbot-messages').innerHTML = ''; // Clear previous messages
            
            // Show error in chat if the key is invalid
            if (!isValid) {
                const errorElement = document.createElement('div');
                errorElement.textContent = 'Error: The selected API key is invalid. Unable to send messages.';
                document.getElementById('chatbot-messages').appendChild(errorElement);
                console.warn(`Invalid API key selected for ${title}`);
            }

            console.log(`${title} chatbot started with API key: ${apiKey}`);
        }

        function updateIcon(iconType) {
            // Update the chatbot icon dynamically
            chatbotIcon.innerHTML = `<img src="/client/chatbot-icon-${iconType}.svg" alt="Chatbot" style="width: 100%; height: 100%; border-radius: 50%;">`;
        }

        function sendMessage() {
            var message = document.getElementById('chatbot-input').value;

            if (!selectedApiKey) {
                alert('Please select a chatbot before sending a message.');
                return;
            }
        
            if (!message.trim()) { // 메시지가 비어있거나 공백만 있는 경우 확인
                alert('Please enter a message before sending.');
                return;
            }
            
            var messageElement = document.createElement('div');
            messageElement.textContent = 'You: ' + message;
            document.getElementById('chatbot-messages').appendChild(messageElement);
            document.getElementById('chatbot-input').value = ''; // 입력 필드 초기화

            // 서버에 메시지 전송
            fetch('/chatbot-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${selectedApiKey}` // API 키를 헤더에 추가
                },
                body: JSON.stringify({ message }) // 메시지를 JSON 형식으로 전송
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // 응답 데이터를 JSON으로 파싱
            })
            .then(data => {
                // 서버에서 받은 응답 메시지를 챗봇 메시지 목록에 추가
                var botMessageElement = document.createElement('div');
                botMessageElement.textContent = 'Bot: ' + data.reply;
                document.getElementById('chatbot-messages').appendChild(botMessageElement);
            })
            .catch(error => {
                console.error('Error:', error);
                // 오류 메시지를 챗봇 메시지 목록에 추가
                var errorMessageElement = document.createElement('div');
                errorMessageElement.style.color = 'red'; // 오류 메시지는 빨간색으로 표시
                errorMessageElement.textContent = 'Error: Unable to send message. ' + error.message;
                document.getElementById('chatbot-messages').appendChild(errorMessageElement);
            });
        }

        document.getElementById('chatbot-send').addEventListener('click', sendMessage);
        document.getElementById('chatbot-input').addEventListener('keyup', function (event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        });
    })();
})();
