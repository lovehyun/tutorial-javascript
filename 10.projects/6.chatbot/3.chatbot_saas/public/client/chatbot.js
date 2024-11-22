(function() {
    // 현재 스크립트의 URL에서 API 키를 가져오는 함수
    function getApiKey() {
        const currentScript = document.currentScript || (function() {
            const scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();
        const scriptSrc = currentScript.src;
        const urlParams = new URLSearchParams(scriptSrc.split('?')[1]);
        return urlParams.get('apiKey'); // API 키 반환
    }

    // 현재 스크립트의 아이콘 타입을 가져오는 함수
    function getIconType() {
        const currentScript = document.currentScript || (function() {
            const scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();
        return currentScript.icon || 1;  // 아이콘 타입 기본값은 1
    }

    // API 키를 변수에 저장
    var apiKey = getApiKey();
    if (!apiKey) {
        console.error('API key is missing'); // API 키가 없으면 에러 출력
        return;
    }

    // 아이콘 타입 설정
    var iconType = getIconType();
    var iconSrc = `/client/chatbot-icon-${iconType}.svg`;

    console.log('Chatbot loaded with API key:', apiKey);

    // 챗봇 아이콘 생성 및 DOM에 추가
    var chatbotIcon = document.createElement('div');
    chatbotIcon.id = 'chatbot-icon';
    chatbotIcon.innerHTML = `<img src="${iconSrc}" alt="Chatbot" style="width: 100%; height: 100%; border-radius: 50%;">`;
    document.body.appendChild(chatbotIcon);

    // 챗봇 컨테이너 생성 및 DOM에 추가
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

    // 챗봇 아이콘 클릭 시 컨테이너 열기/닫기
    chatbotIcon.addEventListener('click', function() {
        if (chatbotContainer.style.display === 'none' || !chatbotContainer.style.display) {
            chatbotContainer.style.display = 'block'; // 챗봇 열기
        } else {
            chatbotContainer.style.display = 'none'; // 챗봇 닫기
        }
    });

    // 메시지 전송 버튼 클릭 이벤트 핸들러
    var chatbotSend = document.getElementById('chatbot-send');
    chatbotSend.addEventListener('click', function() {
        var message = document.getElementById('chatbot-input').value;
        if (message) {
            // 사용자가 입력한 메시지를 챗봇 메시지 목록에 추가
            var messageElement = document.createElement('div');
            messageElement.textContent = 'You: ' + message;
            document.getElementById('chatbot-messages').appendChild(messageElement);
            document.getElementById('chatbot-input').value = ''; // 입력 필드 초기화

            // 서버에 메시지 전송
            fetch('/chatbot-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}` // API 키를 헤더에 추가
                },
                body: JSON.stringify({ message }) // 메시지를 JSON 형식으로 전송
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Invalid API key or server error'); // 에러 발생 시 처리
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
    });
})();
