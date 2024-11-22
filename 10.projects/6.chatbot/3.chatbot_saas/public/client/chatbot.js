(function() {
    function getApiKey() {
        const currentScript = document.currentScript || (function() {
            const scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();
        const scriptSrc = currentScript.src;
        const urlParams = new URLSearchParams(scriptSrc.split('?')[1]);
        return urlParams.get('apiKey');
    }

    function getIconType() {
        const currentScript = document.currentScript || (function() {
            const scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();
        return currentScript.icon || 1;  // 기본값은 1
    }

    var apiKey = getApiKey();
    if (!apiKey) {
        console.error('API key is missing');
        return;
    }

    var iconType = getIconType();
    var iconSrc = `/client/chatbot-icon-${iconType}.svg`;

    console.log('Chatbot loaded with API key:', apiKey);

    var chatbotIcon = document.createElement('div');
    chatbotIcon.id = 'chatbot-icon';
    chatbotIcon.innerHTML = `<img src="${iconSrc}" alt="Chatbot" style="width: 100%; height: 100%; border-radius: 50%;">`;
    document.body.appendChild(chatbotIcon);

    var chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'chatbot-container';
    chatbotContainer.innerHTML = `
        <div id="chatbot-header">Chatbot</div>
        <div id="chatbot-messages"></div>
        <div id="chatbot-input-container">
            <input type="text" id="chatbot-input" placeholder="Type a message..."/>
            <button id="chatbot-send">Send</button>
        </div>
    `;
    document.body.appendChild(chatbotContainer);

    chatbotIcon.addEventListener('click', function() {
        if (chatbotContainer.style.display === 'none' || !chatbotContainer.style.display) {
            chatbotContainer.style.display = 'block';
        } else {
            chatbotContainer.style.display = 'none';
        }
    });

    var chatbotSend = document.getElementById('chatbot-send');
    chatbotSend.addEventListener('click', function() {
        var message = document.getElementById('chatbot-input').value;
        if (message) {
            var messageElement = document.createElement('div');
            messageElement.textContent = 'You: ' + message;
            document.getElementById('chatbot-messages').appendChild(messageElement);
            document.getElementById('chatbot-input').value = '';

            // Send message to the server
            fetch('/chatbot-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
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
        }
    });
})();
