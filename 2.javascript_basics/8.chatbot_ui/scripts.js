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

    function addMessage(message) {
        const messageElement = document.createElement('div'); // 새로운 div 요소 생성
        messageElement.textContent = message; // div 요소에 메시지 텍스트 설정
        chatbotMessages.appendChild(messageElement); // 메시지 창에 div 요소 추가
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // 스크롤을 맨 아래로 이동
    }

    // 메시지 보내기 버튼을 클릭했을 때 실행되는 함수
    sendMessage.addEventListener('click', function() {
        const message = chatbotInput.value.trim(); // 입력된 메시지 가져와서 앞뒤 공백 제거
        if (message) { // 메시지가 비어있지 않은 경우
            addMessage(message);
            chatbotInput.value = ''; // 입력창 비우기
        }
    });

    // 입력창에서 키보드 엔터키를 눌렀을 때 실행되는 함수
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') { // 엔터키가 눌렸을 때
            sendMessage.click(); // 메시지 보내기 버튼 클릭
        }
    });
});
