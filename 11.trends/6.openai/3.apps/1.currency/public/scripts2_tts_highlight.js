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
 * 음성 재생 창 생성 및 관리
 */
function createSpeechReader() {
    // 이미 있는 경우 제거
    const existingReader = document.getElementById('speech-reader');
    if (existingReader) {
        existingReader.remove();
    }

    const readerDiv = document.createElement('div');
    readerDiv.id = 'speech-reader';
    readerDiv.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 400px;
        max-height: 300px;
        background-color: rgba(255, 255, 255, 0.98);
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        overflow-y: auto;
        z-index: 1000;
        font-size: 15px;
        line-height: 1.6;
    `;

    const titleDiv = document.createElement('div');
    titleDiv.style.cssText = `
        font-weight: bold;
        margin-bottom: 10px;
        padding-bottom: 5px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    titleDiv.innerHTML = '📢 읽기 중...';

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '✕';
    closeButton.style.cssText = `
        border: none;
        background: none;
        cursor: pointer;
        padding: 5px;
        font-size: 14px;
        color: #666;
    `;
    closeButton.onclick = () => {
        window.speechSynthesis.cancel();
        readerDiv.remove();
    };
    titleDiv.appendChild(closeButton);

    const contentDiv = document.createElement('div');
    contentDiv.id = 'speech-reader-content';
    
    readerDiv.appendChild(titleDiv);
    readerDiv.appendChild(contentDiv);
    document.body.appendChild(readerDiv);

    return contentDiv;
}

/**
 * 텍스트를 문장과 단어로 분리하여 준비
 */
function prepareTextForReading(text, container) {
    const cleanedText = text.replace(/[-•*]/g, '').trim();
    // 마침표로 끝나는 경우 띄어쓰기가 없어도 분리하되, 추가 마침표는 넣지 않음
    const sentences = cleanedText.split(/(?<=[.!?])(?:\s+|(?=\S))/);
    
    sentences.forEach((sentence, sentenceIndex) => {
        const sentenceDiv = document.createElement('div');
        sentenceDiv.setAttribute('data-sentence-index', sentenceIndex);
        sentenceDiv.style.cssText = `
            display: inline-block;
            margin-right: 4px;
            margin-bottom: 4px;
        `;

        // 문장 끝의 마침표 등을 유지한 채로 단어 분리
        const words = sentence.trim().split(/\s+/);
        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.setAttribute('data-word-index', `${sentenceIndex}-${wordIndex}`);
            wordSpan.textContent = word + (wordIndex < words.length - 1 ? ' ' : '');
            wordSpan.style.padding = '2px';
            sentenceDiv.appendChild(wordSpan);
        });

        container.appendChild(sentenceDiv);
    });

    return sentences;
}

/**
 * 하이라이트와 함께 텍스트 WORD 단위로 읽기
 */
async function speakTextWithHighlightWORD(text, lang = 'ko-KR') {
    return new Promise((resolve) => {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = lang;
        speech.rate = 1;
        speech.pitch = 1;
        speech.volume = 1;

        const readerContent = document.getElementById('speech-reader-content');
        const sentences = prepareTextForReading(text, readerContent);
        
        let previousSentenceIndex = -1;
        let previousWordIndex = -1;

        function findCurrentPosition(charIndex) {
            let accumLength = 0;
            for (let i = 0; i < sentences.length; i++) {
                const sentenceLength = sentences[i].length + 1; // 공백 포함
                accumLength += sentenceLength;
                
                if (charIndex < accumLength) {
                    const words = sentences[i].split(/\s+/);
                    let wordAccumLength = 0;
                    const relativeCharIndex = charIndex - (accumLength - sentenceLength);
                    
                    for (let j = 0; j < words.length; j++) {
                        wordAccumLength += words[j].length + 1;
                        if (relativeCharIndex < wordAccumLength) {
                            return { sentenceIndex: i, wordIndex: j };
                        }
                    }
                    return { sentenceIndex: i, wordIndex: words.length - 1 };
                }
            }
            return { sentenceIndex: sentences.length - 1, wordIndex: 0 };
        }

        speech.onboundary = (event) => {
            if (event.charIndex === undefined) return;
            
            const { sentenceIndex, wordIndex } = findCurrentPosition(event.charIndex);
            
            // 문장 하이라이트
            if (sentenceIndex !== previousSentenceIndex) {
                readerContent.querySelectorAll('[data-sentence-index]').forEach(div => {
                    div.style.backgroundColor = 'transparent';
                });
                
                const currentSentence = readerContent.querySelector(
                    `[data-sentence-index="${sentenceIndex}"]`
                );
                if (currentSentence) {
                    currentSentence.style.backgroundColor = '#fff3b5';
                    currentSentence.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
                previousSentenceIndex = sentenceIndex;
            }

            // 단어 하이라이트
            if (wordIndex !== previousWordIndex || sentenceIndex !== previousSentenceIndex) {
                readerContent.querySelectorAll('[data-word-index]').forEach(span => {
                    span.style.backgroundColor = 'transparent';
                });
                
                const currentWord = readerContent.querySelector(
                    `[data-word-index="${sentenceIndex}-${wordIndex}"]`
                );
                if (currentWord) {
                    currentWord.style.backgroundColor = '#b5ffc3';
                }
                previousWordIndex = wordIndex;
            }
        };

        speech.onend = () => {
            readerContent.querySelectorAll('[data-sentence-index], [data-word-index]')
                .forEach(el => {
                    el.style.backgroundColor = 'transparent';
                });
            resolve();
        };

        window.speechSynthesis.speak(speech);
    });
}

/**
 * 하이라이트와 함께 텍스트 SENTENCE 읽기
 */
async function speakTextWithHighlightSENTENCE(text, lang = 'ko-KR') {
    return new Promise((resolve) => {
        // 원본 텍스트로 바로 음성 객체 생성
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = lang;
        speech.rate = 1;
        speech.pitch = 1;
        speech.volume = 1;

        // UI를 위한 텍스트 처리는 별도로 수행
        const readerContent = document.getElementById('speech-reader-content');
        const sentences = text.split(/(?<=[.!?])\s+/);
        
        // UI 요소 생성 (하이라이트용)
        readerContent.innerHTML = '';
        sentences.forEach((sentence, sentenceIndex) => {
            const sentenceDiv = document.createElement('div');
            sentenceDiv.setAttribute('data-sentence-index', sentenceIndex);
            sentenceDiv.style.cssText = `
                display: inline-block;
                margin-right: 4px;
                margin-bottom: 4px;
                padding: 2px;
            `;
            sentenceDiv.textContent = sentence;
            readerContent.appendChild(sentenceDiv);
        });

        let currentSentenceIndex = 0;

        // onboundary 이벤트에서는 문장 단위 하이라이트만 처리
        speech.onboundary = (event) => {
            if (event.charIndex === undefined) return;
            
            // 현재 문장 찾기
            currentSentenceIndex = 0;
            let charCount = 0;
            for (let i = 0; i < sentences.length; i++) {
                charCount += sentences[i].length + 1; // +1 for space
                if (event.charIndex < charCount) {
                    currentSentenceIndex = i;
                    break;
                }
            }

            // 하이라이트 적용
            readerContent.querySelectorAll('[data-sentence-index]').forEach((div, index) => {
                div.style.backgroundColor = index === currentSentenceIndex ? '#fff3b5' : 'transparent';
                if (index === currentSentenceIndex) {
                    div.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
        };

        speech.onend = () => {
            readerContent.querySelectorAll('[data-sentence-index]').forEach(div => {
                div.style.backgroundColor = 'transparent';
            });
            resolve();
        };

        window.speechSynthesis.speak(speech);
    });
}

/**
 * 언어 감지 로직
 */
function detectLanguageByContents(text) {
    if (/[가-힣]/.test(text)) {
        return 'ko-KR';
    } else if (/[\u4e00-\u9FFF]/.test(text)) {
        return 'zh-CN';
    }
    return 'en-US';
}

/**
 * 환율 변환 함수
 */
async function convertCurrency(speak = false) {
    const amount = parseFloat(document.getElementById('amountInput').value);
    const from = document.getElementById('currencyFromSelect').value;
    const to = document.getElementById('currencyToSelect').value;

    if (!amount || amount <= 0) {
        alert('금액을 올바르게 입력하세요.');
        return;
    }

    disableButton(convertTextButton);
    disableButton(convertAndSpeakButton);

    try {
        const response = await fetch('/api/chat-currency', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, from, to })
        });
        const result = await response.json();
        
        document.getElementById('conversionResult').innerText = 
            `${amount} ${from} → ${result.convertedAmount} ${to}`;
        addMessage(`🤖 AI 설명: ${result.answer}`, false);
        
        if (speak) {
            createSpeechReader();
            // 각 언어별 메시지를 순차적으로 재생
            const messages = result.answer.split('\n').filter(line => line.trim());
            for (const message of messages) {
                const lang = detectLanguageByContents(message);
                await speakTextWithHighlightWORD(message, lang);
                // await speakTextWithHighlightSENTENCE(message, lang);
                // 메시지 사이에 잠시 대기
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    } catch (error) {
        console.error('Error:', error);
        addMessage('환율 변환 중 오류가 발생했습니다.', false);
    } finally {
        enableButton(convertTextButton, '환율 변환 (텍스트)');
        enableButton(convertAndSpeakButton, '환율 변환 및 음성 출력 📢');
    }
}

// 메시지 전송
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

        if (speak) {
            createSpeechReader();
            const lang = detectLanguageByContents(result.answer);
            await speakTextWithHighlightWORD(result.answer, lang);
            // await speakTextWithHighlightSENTENCE(result.answer, lang);
        }
    } catch (error) {
        console.error('Error:', error);
        addMessage('서버 오류가 발생했습니다.', false);
    } finally {
        enableButton(sendButton, 'Send');
        enableButton(speakButton, 'Speak');
    }
}

// 이벤트 리스너 등록
sendButton?.addEventListener('click', () => sendMessage(false));
speakButton?.addEventListener('click', () => sendMessage(true));

// 테스트용 코드
function testSpeakText() {
    createSpeechReader();
    const text = "이것은 한글 문장입니다. This is English sentence. 다시 한글입니다.";
    speakTextWithHighlightWORD(text, detectLanguageByContents(text));
}

// DOM 로드 시 테스트 버튼 추가
document.addEventListener('DOMContentLoaded', () => {
    const testButton = document.createElement('button');
    testButton.innerText = '음성 테스트';
    testButton.onclick = testSpeakText;
    document.body.appendChild(testButton);
});
