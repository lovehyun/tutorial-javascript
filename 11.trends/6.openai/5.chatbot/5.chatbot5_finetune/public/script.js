// public/script.js

document.addEventListener('DOMContentLoaded', async function () {
    const chatContainer = document.getElementById('chat-container');
    const userInputForm = document.getElementById('user-input-form');
    const userInputField = document.getElementById('user-input');
    const submitButton = document.getElementById('submit-button');
    const currentSessionId = document.getElementById('current-session-id');
    const sessionListContainer = document.getElementById('session-list-container');
    const currentSessionDate = document.getElementById('current-session-date');

    let loadingMessageDiv = null;

    submitButton.addEventListener('click', submitUserInput);
    userInputForm.addEventListener('submit', function (event) {
        event.preventDefault();
        submitUserInput();
    });

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

    function appendMessage(role, content) {
        const messageDiv = document.createElement('div');
        const visualRole = role === 'assistant' ? 'chatbot' : role;  // assistant → chatbot

        messageDiv.className = `chat-message ${visualRole}`;
        messageDiv.innerHTML = `<div class="message-content">${content}</div>`;
        chatContainer.appendChild(messageDiv);
    }

    function showLoadingIndicator() {
        hideLoadingIndicator(); // 중복 방지
        loadingMessageDiv = document.createElement('div');
        loadingMessageDiv.className = 'chat-message chatbot';
        loadingMessageDiv.innerHTML = '<div class="message-content"><span class="loading-dots"></span> 생각 중...</div>';
        chatContainer.appendChild(loadingMessageDiv);
        scrollToBottom();
    }

    function hideLoadingIndicator() {
        if (loadingMessageDiv && loadingMessageDiv.parentNode) {
            loadingMessageDiv.parentNode.removeChild(loadingMessageDiv);
            loadingMessageDiv = null;
        }
    }

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

    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function formatResponseForHTML(response) {
        return response.replace(/\n/g, '<br>');
    }

    async function loadChatHistoryAndSession() {
        try {
            const sessionResponse = await fetch('/api/current-session');
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

    function displaySessionInfo(sessionData) {
        if (sessionData?.id && sessionData?.start_time) {
            currentSessionId.textContent = sessionData.id;
            currentSessionDate.textContent = new Date(sessionData.start_time).toLocaleString();
        } else {
            currentSessionId.textContent = 'N/A';
            currentSessionDate.textContent = 'N/A';
        }
    }

    async function updateSessionInfo() {
        try {
            const sessionResponse = await fetch('/api/current-session');
            const sessionData = await sessionResponse.json();
            displaySessionInfo(sessionData);
        } catch (error) {
            console.error('Error updating session info:', error.message);
        }
    }

    const newChatButton = document.getElementById('new-chat-button');
    newChatButton.addEventListener('click', async function () {
        try {
            const response = await fetch('/api/new-session', { method: 'POST' });
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

    function clearChatContainer() {
        chatContainer.innerHTML = '';
        loadAllSessions();
    }

    async function loadAllSessions() {
        try {
            const response = await fetch('/api/all-sessions');
            const data = await response.json();
            sessionListContainer.innerHTML = '';
            data.allSessions.forEach(appendSession);
            addSessionClickListeners();
        } catch (error) {
            console.error('Error loading all sessions:', error.message);
        }
    }

    function appendSession(session) {
        const sessionDiv = document.createElement('div');
        sessionDiv.className = 'session-item';
        sessionDiv.innerHTML = `<a href="#" class="session-link" data-session-id="${session.id}">
            <div class="session-id">${session.id}</div>
            <div class="session-start-time">${new Date(session.start_time).toLocaleString()}</div>
        </a>`;
        sessionListContainer.appendChild(sessionDiv);
    }

    function addSessionClickListeners() {
        const sessionLinks = document.querySelectorAll('.session-link');
        sessionLinks.forEach(link => {
            link.addEventListener('click', async event => {
                event.preventDefault();
                const sessionId = link.dataset.sessionId;
                if (sessionId === currentSessionId.textContent) return;
                await showSession(sessionId);
            });
        });
    }

    async function showSession(sessionId) {
        try {
            const response = await fetch(`/api/session/${sessionId}`);
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

    await loadChatHistoryAndSession();
    await loadAllSessions();
});
