const API_SERVER = 'http://localhost:3000'; // API 서버 주소를 상수로 정의

document.addEventListener("DOMContentLoaded", function() {
    // DOMContentLoaded 이벤트가 발생하면 콜백 함수 실행
    const chatbotIcon = document.getElementById('chatbotIcon'); // 챗봇 아이콘 요소 선택
    const chatbotWindow = document.getElementById('chatbotWindow'); // 챗봇 창 요소 선택
    const closeChatbot = document.getElementById('closeChatbot'); // 챗봇 창 닫기 버튼 요소 선택
    const sendMessage = document.getElementById('sendMessage'); // 메시지 보내기 버튼 요소 선택
    const chatbotMessages = document.getElementById('chatbotMessages'); // 메시지 창 요소 선택
    const chatbotInput = document.getElementById('chatbotInput'); // 메시지 입력창 요소 선택

    // 챗봇 아이콘을 클릭했을 때 실행되는 함수
    chatbotIcon.addEventListener('click', function() {
        chatbotIcon.style.display = 'none'; // 챗봇 아이콘 숨기기
        chatbotWindow.style.display = 'flex'; // 챗봇 창 보이기
    });

    // 챗봇 창 닫기 버튼을 클릭했을 때 실행되는 함수
    closeChatbot.addEventListener('click', function() {
        chatbotWindow.style.display = 'none'; // 챗봇 창 숨기기
        chatbotIcon.style.display = 'flex'; // 챗봇 아이콘 보이기
    });

    // function addMessage(message, sender = 'user') {
    //     const messageElement = document.createElement('div'); // 새로운 div 요소 생성
    //     // messageElement.textContent = message; // div 요소에 메시지 텍스트 설정
    //     messageElement.textContent = sender === 'user' ? `👤: ${message}` : `🤖: ${message}`;
    //     chatbotMessages.appendChild(messageElement); // 메시지 창에 div 요소 추가
    //     chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // 스크롤을 맨 아래로 이동
    // }

    function addStreamMessage(message, sender = 'user') {
        const messageElement = document.createElement('div'); 
        messageElement.classList.add(sender); 
        messageElement.textContent = sender === 'user' ? `👤: ${message}` : `🤖: `;
        chatbotMessages.appendChild(messageElement); 
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        // 스트리밍을 위한 메시지 업데이트 지원
        if (sender === 'bot') {
            return messageElement; // 메시지 요소를 반환하여 스트리밍 중 업데이트 가능
        }
    }

    // 메시지 보내기 버튼을 클릭했을 때 실행되는 함수
    // sendMessage.addEventListener('click', function() {
    //     const message = chatbotInput.value.trim(); // 입력된 메시지 가져와서 앞뒤 공백 제거
    //     if (message) { // 메시지가 비어있지 않은 경우
    //         addMessage(message);
    //         chatbotInput.value = ''; // 입력창 비우기
    //     }
    // });
    sendMessage.addEventListener('click', handleUserStreamMessage);

    // 입력창에서 키보드 엔터키를 눌렀을 때 실행되는 함수
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') { // 엔터키가 눌렸을 때
            // sendMessage.click(); // 메시지 보내기 버튼 클릭
            handleUserStreamMessage();
        }
    });

    /**
     * 메시지 전송 처리 (기본적으로 일반 비스트리밍)
     */
    // async function handleUserMessage() {
    //     const message = chatbotInput.value.trim();
    //     if (message) {
    //         addMessage(message, 'user');
    //         chatbotInput.value = '';

    //         // 일반 요청 (기본)
    //         const botResponse = await sendMessageToServer(message);
    //         addMessage(botResponse, 'bot');
    //     }
    // }

    /**
     * 메시지 전송 처리 (기본적으로 일반 비스트리밍)
     */
    async function handleUserStreamMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            addStreamMessage(message, 'user');
            chatbotInput.value = '';

            // 일반 요청 (기본)
            // const botResponse = await sendMessageToServer(message);
            // const botResponse = await sendGetStreamingMessageToServer(message);
            const botResponse = await sendPostStreamingMessageToServer(message);
        }
    }

    /**
     * 일반 비스트리밍 요청 처리
     */
    async function sendMessageToServer(question) {
        try {
            const response = await fetch(`${API_SERVER}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question })
            });
            const data = await response.json();
            return data.answer;
        } catch (error) {
            console.error('서버와의 연결 오류:', error);
            return '서버와 연결할 수 없습니다.';
        }
    }

    /**
     * 스트리밍 요청 처리 (GET)
     */
    async function sendGetStreamingMessageToServer(question) {
        // GET 요청으로 question을 쿼리스트링으로 전달
        const eventSource = new EventSource(`${API_SERVER}/api/chat-stream?question=${encodeURIComponent(question)}`);

        // 스트리밍용 메시지 블록 생성
        const botMessageElement = addStreamMessage('', 'bot'); 

        // 수신한 데이터 처리
        eventSource.onmessage = (event) => {
            if (event.data === '[DONE]') {
                eventSource.close(); // 스트리밍 완료 시 종료
                return;
            }
            try {
                const responseData = JSON.parse(event.data);
                botMessageElement.textContent += responseData.content; // 실시간으로 메시지 업데이트
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            } catch (error) {
                console.error('데이터 파싱 오류:', error);
            }
        };

        // 연결 오류 발생 시 처리
        eventSource.onerror = (error) => {
            console.error('스트리밍 오류:', error);
            eventSource.close();
        };
    }

    /**
     * 스트리밍 요청 처리 (POST)
     */
    async function sendPostStreamingMessageToServer(question) {
        const response = await fetch(`${API_SERVER}/api/chat-stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question })
        });

        // 메시지 블록을 한 번만 추가
        const botMessageElement = addStreamMessage('', 'bot'); 

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');

        let accumulatedChunk = ''; // 누적 버퍼 추가

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            accumulatedChunk += decoder.decode(value, { stream: true });
            
            // 여러 줄이 포함된 경우 분리해서 처리
            const lines = accumulatedChunk.split('\n');
            accumulatedChunk = lines.pop();  // 마지막 줄은 미완성일 가능성 있음

            for (const line of lines) {
                const trimmedLine = line.trim();

                // [DONE] 신호 처리
                if (trimmedLine === 'data: [DONE]') {
                    // console.log('스트리밍 완료');
                    return;
                }

                // 데이터 파싱 전 "data:" 제거 후 검사
                if (trimmedLine.startsWith('data: ')) {
                    try {
                        const jsonData = trimmedLine.replace('data: ', '').trim();
                        const responseData = JSON.parse(jsonData);
                        botMessageElement.textContent += responseData.content;
                    } catch (error) {
                        console.error('데이터 파싱 오류:', error, trimmedLine);
                    }
                }
            }

            // 스크롤 조정
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
    }

});
