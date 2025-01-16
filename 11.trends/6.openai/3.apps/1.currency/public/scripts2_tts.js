const questionInput = document.getElementById('chatbotInput');
const sendButton = document.getElementById('sendMessage');
const speakButton = document.getElementById('speakMessage');
const convertTextButton = document.getElementById('convertTextButton');
const convertAndSpeakButton = document.getElementById('convertAndSpeakButton');
const chatbotMessages = document.getElementById('chatbotMessages');

/**
 * 버튼 비활성화 함수 (로딩 상태)
 */
function disableButton(button) {
    button.disabled = true;
    button.innerHTML = '진행 중...';
    button.classList.add('opacity-50', 'cursor-not-allowed');
}

/**
 * 버튼 활성화 함수 (정상 상태)
 */
function enableButton(button, originalText) {
    button.disabled = false;
    button.innerText = originalText;
    button.classList.remove('opacity-50', 'cursor-not-allowed');
}

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
 * TTS를 사용하여 음성으로 읽어주는 함수 (다국어 지원)
 * @param {string} text - 읽어줄 텍스트
 * @param {string} lang - 언어 설정 (기본값: 한국어)
 */
function speakText(text, lang = 'ko-KR') {
    // 특수 문제 제거 (예: - 제거)
    const cleanedText = text.replace(/[-•*]/g, '').trim();
    const speech = new SpeechSynthesisUtterance(cleanedText); // 음성 객체 생성
    speech.lang = lang; // 언어 설정
    speech.rate = 1;    // 읽기 속도 (1.0 = 기본)
    speech.pitch = 1;   // 음성 톤
    speech.volume = 1;  // 음량 설정 (0~1)

    window.speechSynthesis.speak(speech); // 브라우저 TTS 기능 실행
}

/**
 * 언어 감지 로직 (간단한 로직 기반)
 * @param {string} text - 감지할 텍스트
 * @returns {string} - ISO 언어 코드 (ko-KR, en-US, zh-CN)
 */
function detectLanguageByContents(text) {
    // 간단한 패턴 기반 감지
    if (/[가-힣]/.test(text)) {
        return 'ko-KR';  // 한글
    } else if (/[\u4e00-\u9FFF]/.test(text)) {
        return 'zh-CN';  // 한자
    } else if (/[a-zA-Z]/.test(text)) {
        return 'en-US';  // 영어
    }
    // 기본값은 영어로 설정
    return 'en-US';
}

/**
 * 메시지 전송 + 음성 출력 (통합)
 * @param {boolean} speak - true: TTS 포함 / false: TTS 미포함
 */
async function sendMessage(speak = false) {
    const question = questionInput.value.trim();
    if (!question) return;

    addMessage(`👤 사용자: ${question}`);
    questionInput.value = '';
    disableButton(sendButton);
    disableButton(speakButton);

    try {
        const response = await fetch('/api/chat-stream', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question })
        });
        const result = await response.json();
        addMessage(`🤖 AI: ${result.answer}`, false);

        // TTS 기능 추가
        if (speak) {
            const lang = detectLanguageByContents(result.answer)
            speakText(result.answer, lang);
        }
    } catch (error) {
        console.error('Error:', error);
        addMessage('서버 오류가 발생했습니다.', false);
    } finally {
        enableButton(sendButton, 'Send');
        enableButton(speakButton, 'Speak');
    }
}

sendButton.addEventListener('click', () => sendMessage(false));
speakButton.addEventListener('click', () => sendMessage(true));

/**
 * ✅ 언어 감지 및 TTS 음성 선택
 * @param {string} text - 읽어줄 텍스트
 */
function detectLanguageAndSpeak(text) {
    // 한국어, 영어, 중국어 간단 감지
    if (text.includes('한국어:')) {
        speakText(text.replace('한국어:', '').trim(), 'ko-KR');
    } else if (text.includes('English:')) {
        speakText(text.replace('English:', '').trim(), 'en-US');
    } else if (text.includes('Chinese:')) {
        speakText(text.replace('Chinese:', '').trim(), 'zh-CN');
    } else {
        // 기본 언어를 한국어로 설정
        speakText(text, 'ko-KR');
    }
}

/**
 * 환율 변환 (버튼별 기능 통합)
 * @param {boolean} speak - true: 변환 + 음성 / false: 변환만
 */
async function convertCurrency(speak = false) {
    const amount = parseFloat(document.getElementById('amountInput').value);
    const from = document.getElementById('currencyFromSelect').value;
    const to = document.getElementById('currencyToSelect').value;

    if (!amount || amount <= 0) {
        alert('금액을 올바르게 입력하세요.');
        return;
    }

    // 버튼 비활성화
    disableButton(convertTextButton);
    disableButton(convertAndSpeakButton);

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
        
        // 음성 출력 (한국어, 영어, 중국어 순서로)
        if (speak) {
            const messages = result.answer.split('\n').filter(line => line.trim() !== ''); 
            for (const line of messages) {
                console.log(line);
                detectLanguageAndSpeak(line);
            }
        }
    } catch (error) {
        console.error('Error:', error);
        addMessage('환율 변환 중 오류가 발생했습니다.', false);
    } finally {
        // 버튼 다시 활성화
        enableButton(convertTextButton, '환율 변환 (텍스트)');
        enableButton(convertAndSpeakButton, '환율 변환 및 음성 출력 📢');
    }
}
