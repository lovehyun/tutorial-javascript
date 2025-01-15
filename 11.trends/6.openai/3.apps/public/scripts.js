const questionInput = document.getElementById('chatbotInput');
const sendButton = document.getElementById('sendMessage');
const chatbotMessages = document.getElementById('chatbotMessages');

/**
 * 메시지 추가 (챗봇 UI 개선)
 */
function addMessage(content, isUser = true) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    messageDiv.innerText = content;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

/**
 * 챗봇 메시지 전송
 */
sendButton.addEventListener('click', async () => {
    const question = questionInput.value.trim();
    if (!question) return;

    addMessage(`👤 사용자: ${question}`);
    questionInput.value = '';

    try {
        const response = await fetch('/api/chat-stream', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question })
        });
        const result = await response.json();
        addMessage(`🤖 AI: ${result.answer}`, false);
    } catch (error) {
        console.error('Error:', error);
        addMessage('서버 오류가 발생했습니다.', false);
    }
});

/**
 * 환율 변환
 */
async function convertCurrency() {
    const amount = parseFloat(document.getElementById('amountInput').value);
    const from = document.getElementById('currencyFromSelect').value;
    const to = document.getElementById('currencyToSelect').value;

    if (!amount || amount <= 0) {
        alert('금액을 올바르게 입력하세요.');
        return;
    }

    try {
        const response = await fetch('/api/chat-currency', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, from, to })
        });
        const result = await response.json();
        
        // 환율 결과 및 AI 응답 출력
        document.getElementById('conversionResult').innerText = 
            `${amount} ${from} → ${result.convertedAmount} ${to}`;
        addMessage(`🤖 AI 설명: ${result.answer}`, false);
        
    } catch (error) {
        console.error('Error:', error);
        addMessage('환율 변환 중 오류가 발생했습니다.', false);
    }
}
