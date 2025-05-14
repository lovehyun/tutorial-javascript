document.addEventListener('DOMContentLoaded', async function () {
    // DOM 요소 참조
    const chatContainer = document.getElementById('chat-container');
    const userInputForm = document.getElementById('user-input-form');
    const userInputField = document.getElementById('user-input');
    const submitButton = document.getElementById('submit-button');
    const currentSessionId = document.getElementById('current-session-id');
    const sessionListContainer = document.getElementById('session-list-container');
    const currentSessionDate = document.getElementById('current-session-date');

    let loadingMessageDiv = null; // 로딩중 표시용 요소

    // 이벤트 리스너 설정
    submitButton.addEventListener('click', submitUserInput);
    userInputForm.addEventListener('submit', function (event) {
        event.preventDefault();
        submitUserInput();
    });

    // 사용자 입력 처리 및 챗봇 응답 요청
    async function submitUserInput() {
        const userInput = userInputField.value.trim();
        const sessionId = currentSessionId.textContent;

        if (!userInput || !sessionId) return;

        appendMessage('user', userInput);
        showLoadingIndicator();
        scrollToBottom();

        try {
            const chatGPTResponse = await getChatGPTResponse(sessionId, userInput);
            hideLoadingIndicator();
            const formattedResponse = formatResponseForHTML(chatGPTResponse);
            appendMessage('chatbot', formattedResponse);
        } catch (error) {
            hideLoadingIndicator();
            console.error('Error making ChatGPT API request:', error.message);
            appendMessage('chatbot', '챗봇 응답을 가져오는 도중에 오류가 발생했습니다.');
        }

        userInputField.value = '';
        scrollToBottom();
    }

    // 채팅 메시지 DOM에 추가
    function appendMessage(role, content) {
        const messageDiv = document.createElement('div');
        const visualRole = role === 'assistant' ? 'chatbot' : role;

        messageDiv.className = `chat-message ${visualRole}`;
        messageDiv.innerHTML = `<div class="message-content">${content}</div>`;
        chatContainer.appendChild(messageDiv);
    }

    // 로딩 인디케이터 표시
    function showLoadingIndicator() {
        hideLoadingIndicator();
        loadingMessageDiv = document.createElement('div');
        loadingMessageDiv.className = 'chat-message chatbot';
        loadingMessageDiv.innerHTML = '<div class="message-content"><span class="loading-dots"></span> 생각 중...</div>';
        chatContainer.appendChild(loadingMessageDiv);
        scrollToBottom();
    }

    // 로딩 인디케이터 제거
    function hideLoadingIndicator() {
        if (loadingMessageDiv && loadingMessageDiv.parentNode) {
            loadingMessageDiv.parentNode.removeChild(loadingMessageDiv);
            loadingMessageDiv = null;
        }
    }

    // 챗봇 응답 요청
    async function getChatGPTResponse(sessionId, userInput) {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId, userInput }),
        });

        const data = await response.json();
        return data.chatGPTResponse;
    }

    // 채팅창 하단으로 스크롤
    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // 개행 문자 HTML 변환
    function formatResponseForHTML(response) {
        return response.replace(/\n/g, '<br>');
    }

    // 현재 세션 및 대화 내역 불러오기
    async function loadChatHistoryAndSession() {
        try {
            const sessionResponse = await fetch('/api/sessions/latest');
            const sessionData = await sessionResponse.json();

            sessionData.conversationHistory.forEach(item => {
                const formatted = formatResponseForHTML(item.content);
                appendMessage(item.role, formatted);
            });

            displaySessionInfo(sessionData);
            scrollToBottom();
        } catch (error) {
            console.error('Error loading chat history and session:', error.message);
        }
    }

    // 세션 정보 화면에 표시
    function displaySessionInfo(sessionData) {
        if (sessionData?.id && sessionData?.start_time) {
            currentSessionId.textContent = sessionData.id;
            currentSessionDate.textContent = new Date(sessionData.start_time).toLocaleString();
        } else {
            currentSessionId.textContent = 'N/A';
            currentSessionDate.textContent = 'N/A';
        }
    }

    // 현재 세션 정보 갱신
    async function updateSessionInfo() {
        try {
            const sessionResponse = await fetch('/api/sessions/latest');
            const sessionData = await sessionResponse.json();
            displaySessionInfo(sessionData);
        } catch (error) {
            console.error('Error updating session info:', error.message);
        }
    }

    // 새 세션 생성 버튼 클릭 이벤트
    const newChatButton = document.getElementById('new-chat-button');
    newChatButton.addEventListener('click', async function () {
        try {
            const response = await fetch('/api/sessions', { method: 'POST' });
            const data = await response.json();
            if (data.success) {
                await updateSessionInfo();
                clearChatContainer();
            } else {
                console.error('Error starting new session:', data.error);
            }
        } catch (error) {
            console.error('Error starting new session:', error.message);
        }
    });

    // 채팅창 초기화
    function clearChatContainer() {
        chatContainer.innerHTML = '';
        loadAllSessions();
    }

    // 전체 세션 목록 로드
    async function loadAllSessions() {
        try {
            const response = await fetch('/api/sessions');
            const data = await response.json();
            sessionListContainer.innerHTML = '';
            data.allSessions.forEach(appendSession);
            addSessionClickListeners();
        } catch (error) {
            console.error('Error loading all sessions:', error.message);
        }
    }

    // 세션 리스트에 세션 항목 추가
    function appendSession(session) {
        const sessionDiv = document.createElement('div');
        sessionDiv.className = 'session-item';
        sessionDiv.innerHTML = `<a href="#" class="session-link" data-session-id="${session.id}">
            <div class="session-id">${session.id}</div>
            <div class="session-start-time">${new Date(session.start_time).toLocaleString()}</div>
        </a>`;
        sessionListContainer.appendChild(sessionDiv);
    }

    // 세션 항목 클릭 시 해당 대화 불러오기
    function addSessionClickListeners() {
        const sessionLinks = document.querySelectorAll('.session-link');
        sessionLinks.forEach(link => {
            link.addEventListener('click', async (event) => {
                event.preventDefault();
                const sessionId = link.dataset.sessionId;
                if (sessionId === currentSessionId.textContent) return;
                await showSession(sessionId);
            });
        });
    }

    // 특정 세션 로딩
    async function showSession(sessionId) {
        try {
            const response = await fetch(`/api/sessions/${sessionId}`);
            const data = await response.json();
            chatContainer.innerHTML = '';
            data.conversationHistory.forEach(item => {
                const formatted = formatResponseForHTML(item.content);
                appendMessage(item.role, formatted);
            });
            displaySessionInfo(data);
            currentSessionId.textContent = data.id;
            scrollToBottom();
        } catch (error) {
            console.error('Error loading session:', error.message);
        }
    }

    // 초기화
    await loadChatHistoryAndSession();
    await loadAllSessions();
});
