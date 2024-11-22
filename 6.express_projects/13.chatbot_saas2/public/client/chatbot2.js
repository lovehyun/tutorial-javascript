(function () {
    function getApiKeys() {
        const currentScript = document.currentScript || (function () {
            const scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();
        const scriptSrc = currentScript.src;
        const urlParams = new URLSearchParams(scriptSrc.split('?')[1]);
        const apiKey1 = urlParams.get('apiKey1');
        const apiKey2 = urlParams.get('apiKey2');
        return { apiKey1, apiKey2 };
    }

    var { apiKey1, apiKey2 } = getApiKeys();

    if (!apiKey1) {
        console.error('At least one API key is required');
        return;
    }

    console.log('Chatbot loaded with API keys:', { apiKey1, apiKey2 });

    // Create chatbot icon
    var chatbotIcon = document.createElement('div');
    chatbotIcon.id = 'chatbot-icon';
    chatbotIcon.innerHTML = `<img src="/client/chatbot-icon-3.svg" alt="Chatbot" style="width: 100%; height: 100%; border-radius: 50%;">`;
    document.body.appendChild(chatbotIcon);

    // Create chatbot selection popup
    if (apiKey1 && apiKey2) {
        var chatbotSelection = document.createElement('div');
        chatbotSelection.id = 'chatbot-selection';
        chatbotSelection.innerHTML = `
            <div id="chatbot-selection-header">Select a Chatbot</div>
            <button id="chatbot1" class="chatbot-option">Chatbot1 Q&A</button>
            <button id="chatbot2" class="chatbot-option">Chatbot2 Q&A</button>
        `;
        chatbotSelection.style.display = 'none';
        document.body.appendChild(chatbotSelection);
    }

    // Chatbot container
    var chatbotContainer = document.createElement('div');
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

    let selectedApiKey = apiKey1; // Default to apiKey1 if only one is present
    let selectedChatbot = 'Chatbot1'; // Default to Chatbot1

    // Toggle chatbot icon functionality
    chatbotIcon.addEventListener('click', function () {
        if (chatbotContainer.style.display === 'block') {
            // If chat is open, close it
            chatbotContainer.style.display = 'none';
            updateIcon(3); // Reset to default icon (icon 3)
            selectedApiKey = apiKey1; // Reset to default key
            selectedChatbot = 'Chatbot1';
            console.log('Chatbot closed.');
        } else if (apiKey1 && apiKey2 && (chatbotSelection.style.display === 'none' || chatbotSelection.style.display === '')) {
            // Open selection popup if there are two keys
            chatbotSelection.style.display = 'block';
        } else if (apiKey1 && apiKey2) {
            // Close selection popup
            chatbotSelection.style.display = 'none';
        } else {
            // Open chat directly for single API key
            openChatbot('Chatbot1', apiKey1, 1);
        }
    });

    // Event listeners for chatbot options (only if 2 keys are available)
    if (apiKey1 && apiKey2) {
        document.getElementById('chatbot1').addEventListener('click', function () {
            openChatbot('Chatbot1', apiKey1, 1);
        });

        document.getElementById('chatbot2').addEventListener('click', function () {
            openChatbot('Chatbot2', apiKey2, 2);
        });
    }

    function openChatbot(type, apiKey, iconType) {
        if (apiKey1 && apiKey2) chatbotSelection.style.display = 'none'; // Hide selection if present
        chatbotContainer.style.display = 'block';

        selectedApiKey = apiKey;
        selectedChatbot = type;

        document.getElementById('chatbot-header').textContent = type;
        updateIcon(iconType); // Set icon to the selected chatbot's type
        document.getElementById('chatbot-messages').innerHTML = ''; // Clear previous messages
        console.log(`${type} chatbot started with API key: ${apiKey}`);
    }

    function updateIcon(iconType) {
        // Update the chatbot icon dynamically
        chatbotIcon.innerHTML = `<img src="/client/chatbot-icon-${iconType}.svg" alt="Chatbot" style="width: 100%; height: 100%; border-radius: 50%;">`;
    }

    document.getElementById('chatbot-send').addEventListener('click', function () {
        var message = document.getElementById('chatbot-input').value;
        if (message && selectedApiKey) {
            var messageElement = document.createElement('div');
            messageElement.textContent = 'You: ' + message;
            document.getElementById('chatbot-messages').appendChild(messageElement);
            document.getElementById('chatbot-input').value = '';

            // Send message to the server
            fetch('/chatbot-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${selectedApiKey}`
                },
                body: JSON.stringify({ message })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    var botMessageElement = document.createElement('div');
                    botMessageElement.textContent = 'Bot: ' + data.reply;
                    document.getElementById('chatbot-messages').appendChild(botMessageElement);
                })
                .catch(error => console.error('Error:', error));
        } else {
            alert('Please select a chatbot before sending a message.');
        }
    });
})();
