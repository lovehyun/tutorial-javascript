document.addEventListener("DOMContentLoaded", function () {
    // DOM 요소 선택
    const chatbotIcon = document.getElementById('chatbotIcon');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const closeChatbot = document.getElementById('closeChatbot');
    const sendMessage = document.getElementById('sendMessage');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const userInfoContainer = document.getElementById('userInfoContainer');
    const userNameInput = document.getElementById('userNameInput');
    const userEmailInput = document.getElementById('userEmailInput');
    const saveUserInfoButton = document.getElementById('saveUserInfoButton');
    const cancelUserInfoButton = document.getElementById('cancelUserInfoButton');
    const editUserInfoButton = document.getElementById('editUserInfoButton');
    const helpButton = document.getElementById('helpButton');
    const getChannelManagersButton = document.getElementById('getChannelManagers');
    const selectedManager = document.getElementById('selectedManager');
    const userId = Date.now(); // 고유 사용자 ID 생성

    let lastMessageId = 0; // 마지막 메시지 ID 추적

    // --- 이벤트 리스너 ---
    chatbotIcon.addEventListener('click', openChatbot);
    closeChatbot.addEventListener('click', closeChatbotWindow);
    sendMessage.addEventListener('click', handleSendMessage);
    chatbotInput.addEventListener('keypress', handleChatInputKeyPress);
    editUserInfoButton.addEventListener('click', handleEditUserInfoClick);
    helpButton.addEventListener('click', handleHelpButtonClick);
    saveUserInfoButton.addEventListener('click', saveUserInfo);
    cancelUserInfoButton.addEventListener('click', cancelUserInfo);
    getChannelManagersButton.addEventListener('click', fetchManagers);

    // --- 핵심 기능 ---

    // 1. Chatbot 열기
    function openChatbot() {
        chatbotIcon.style.display = 'none';
        chatbotWindow.style.display = 'flex';
    }

    // 2. Chatbot 닫기
    function closeChatbotWindow() {
        chatbotWindow.style.display = 'none';
        chatbotIcon.style.display = 'flex';
    }

    // 3. 메시지 전송 처리
    function handleSendMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            // appendMessage(message, false); // 화면에 바로 출력
            chatbotInput.value = ''; // 입력 필드 초기화
            sendMessageToServer(message); // 서버로 메시지 전송
        }
    }

    // 4. 키보드 입력 처리
    function handleChatInputKeyPress(e) {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    }

    // 5. USER 버튼 클릭 처리
    function handleEditUserInfoClick() {
        const userInfo = getUserInfoFromStorage();
    
        if (userInfo) {
            userNameInput.value = userInfo.name || ''; // 이전 이름 불러오기
            userEmailInput.value = userInfo.email || ''; // 이전 이메일 불러오기
        } else {
            userNameInput.value = '';
            userEmailInput.value = '';
        }
    
        appendMessage('사용자 정보를 입력하세요.', false);
        showUserInfoInput(); // 사용자 정보 입력창 표시
    }
    
    // 6. HELP 버튼 클릭 처리
    function handleHelpButtonClick() {
        const userInfo = getUserInfoFromStorage();

        if (!userInfo) {
            appendMessage('도움을 요청하려면 사용자 정보를 입력해주세요.', false);
            showUserInfoInput();
            return;
        }

        if (!selectedManager.value) {
            appendMessage('도움을 요청하려면 담당자를 선택해주세요.', false);
            return;
        }

        appendMessage(`담당자를 호출하고 있습니다: ${userInfo.name} (${userInfo.email})...`, false);

        fetch('/api/help', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userInfo.userId,
                name: userInfo.name,
                email: userInfo.email,
                managerId: selectedManager.value,
                message: `사용자 ${userInfo.name} (${userInfo.email})이(가) 도움을 요청합니다.`,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('도움 요청 전송 성공:', data);
                appendMessage(`담당자 호출 요청이 성공적으로 전송되었습니다: ${userInfo.name} (${userInfo.email}).`, false);
            })
            .catch((error) => {
                console.error('도움 요청 전송 실패:', error);
                appendMessage('담당자 호출 요청을 전송하지 못했습니다. 다시 시도해주세요.', false);
            });
    }

    // 7. 사용자 정보 저장
    function saveUserInfo() {
        const name = userNameInput.value.trim();
        const email = userEmailInput.value.trim();

        if (!name || !email) {
            appendMessage('이름과 이메일을 모두 입력해야 합니다.', false);
            return;
        }

        const userInfo = { userId, name, email };
        saveUserInfoToStorage(userInfo);
        appendMessage(`사용자 정보가 저장되었습니다. 이름: ${name}, 이메일: ${email}`, false);

        hideUserInfoInput(); // 정보 저장 후 입력 필드 숨기기
    }

    // 8. 사용자 정보 입력 취소
    function cancelUserInfo() {
        appendMessage('사용자 정보 수정이 취소되었습니다.', false);
        hideUserInfoInput();
    }

    // --- Helper Functions ---

    // 메시지 DOM에 추가
    function appendMessage(message, fromAdmin, name) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', fromAdmin ? 'admin' : 'user');

        if (name) {
            const nameElement = document.createElement('span');
            nameElement.classList.add('message-author');
            nameElement.textContent = fromAdmin ? `[매니저: ${name}] ` : `[${name}] `;
            messageElement.appendChild(nameElement);
        }

        const textElement = document.createElement('span');
        textElement.textContent = message;
        messageElement.appendChild(textElement);

        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // 서버로 메시지 전송
    function sendMessageToServer(message) {
        const userInfo = getUserInfoFromStorage();

        const payload = userInfo
            ? { userId: userInfo.userId, name: userInfo.name, email: userInfo.email, message, timestamp: new Date() }
            : { userId, message, timestamp: new Date() };

        fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(response => response.json())
            .then(data => console.log('메시지 전송 성공:', data))
            .catch(error => console.error('메시지 전송 실패:', error));
    }

    // 서버로부터 메시지 확인
    function fetchMessages() {
        const userInfo = getUserInfoFromStorage();
        const savedUserId = userInfo ? userInfo.userId : userId;

        fetch(`/api/admin/messages?userId=${savedUserId}`)
            .then((response) => response.json())
            .then((messages) => {
                console.log('서버에서 가져온 메시지:', messages);

                if (lastMessageId === 0) {
                    // 모든 메시지를 가져와 화면에 출력 (최초 로드)
                    messages.forEach((msg) => {
                        appendMessage(msg.text, msg.fromAdmin, msg.name);
                    });
                } else {
                    // 새 메시지만 가져오기
                    messages
                        .filter((msg) => msg.id > lastMessageId)
                        .forEach((msg) => {
                            appendMessage(msg.text, msg.fromAdmin, msg.name);
                        });
                }

                // 마지막 메시지 ID 업데이트
                if (messages.length > 0) {
                    lastMessageId = messages[messages.length - 1].id;
                }
            })
            .catch((error) => console.error('Error fetching messages:', error));
    }

    // 사용자 정보 로컬스토리지에서 가져오기
    function getUserInfoFromStorage() {
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo) : null;
    }

    // 사용자 정보 로컬스토리지에 저장
    function saveUserInfoToStorage(userInfo) {
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }

    // 사용자 정보 입력 필드 표시
    function showUserInfoInput() {
        userInfoContainer.style.display = 'block';
    }

    // 사용자 정보 입력 필드 숨기기
    function hideUserInfoInput() {
        userInfoContainer.style.display = 'none';
    }

    // Discord 채널 관리자 목록 가져오기
    function fetchManagers() {
        console.log('채널 담당자 목록을 가져오는 중...');

        fetch('/api/users')
            .then((response) => response.json())
            .then((users) => {
                console.log('채널 담당자 목록:', users);

                selectedManager.innerHTML = '';
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.disabled = true;
                defaultOption.selected = true;
                defaultOption.textContent = '담당자를 선택하세요';
                selectedManager.appendChild(defaultOption);

                users.forEach((user) => {
                    const option = document.createElement('option');
                    option.value = user.id;
                    option.textContent = user.displayName || user.username;
                    selectedManager.appendChild(option);
                });
            })
            .catch((error) => console.error('채널 담당자 목록 가져오기 실패:', error));
    }

    // 초기화 작업
    function initializeChatbot() {
        fetchManagers(); // 페이지 로드 시 담당자 목록 가져오기
        fetchMessages(); // 페이지 로드 시 이전 대화 목록 가져오기
        setInterval(fetchMessages, 5000); // 이후 5초마다 업데이트
    }

    initializeChatbot();
});
