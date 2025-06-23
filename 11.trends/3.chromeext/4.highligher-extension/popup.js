// DOM 로드 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 이벤트 리스너 등록
    document.getElementById('addWord').addEventListener('click', addWord);
    document.getElementById('wordInput').addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            addWord();
        }
    });
    document.getElementById('toggleHighlight').addEventListener('change', toggleHighlight);

    // 초기 설정
    updateWordList();
    loadHighlightStatus();
});

// 단어 추가
function addWord() {
    const wordInput = document.getElementById('wordInput');
    const word = wordInput.value.trim();

    if (word) {
        getStoredWords((words) => {
            if (!words.includes(word)) {
                words.push(word);
                setStoredWords(words, () => {
                    updateWordList();
                    sendUpdateMessage();
                    wordInput.value = '';
                });
            }
        });
    }
}

// 하이라이트 토글
function toggleHighlight(event) {
    const isEnabled = event.target.checked;
    setHighlightStatus(isEnabled);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, { 
                action: 'toggleHighlight',
                highlightEnabled: isEnabled 
            }, () => {
                if (chrome.runtime.lastError) {
                    // 무시 (일부 페이지에서는 content script가 없을 수 있음)
                }
            });
        }
    });
}

// 단어 목록 UI 업데이트
function updateWordList() {
    getStoredWords((words) => {
        const wordList = document.getElementById('wordList');
        wordList.innerHTML = '';
        
        words.forEach((word) => {
            const li = document.createElement('li');
            li.textContent = word;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'X';
            deleteButton.addEventListener('click', () => {
                removeWord(word);
            });

            li.appendChild(deleteButton);
            wordList.appendChild(li);
        });
    });
}

// 단어 삭제
function removeWord(wordToRemove) {
    getStoredWords((words) => {
        const updatedWords = words.filter((word) => word !== wordToRemove);
        setStoredWords(updatedWords, () => {
            updateWordList();
            sendUpdateMessage();
        });
    });
}

// 하이라이트 상태 로드
function loadHighlightStatus() {
    getHighlightStatus((isEnabled) => {
        document.getElementById('toggleHighlight').checked = isEnabled;
    });
}

// content script에 업데이트 메시지 전송
function sendUpdateMessage() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'updateHighlight' }, () => {
                if (chrome.runtime.lastError) {
                    // 무시
                }
            });
        }
    });
}

// ===== 저장소 함수들 =====

function getStoredWords(callback) {
    chrome.storage.sync.get({ words: [] }, (data) => {
        callback(data.words);
    });
}

function setStoredWords(words, callback) {
    chrome.storage.sync.set({ words }, callback);
}

function getHighlightStatus(callback) {
    chrome.storage.sync.get({ highlightEnabled: true }, (data) => {
        callback(data.highlightEnabled);
    });
}

function setHighlightStatus(isEnabled) {
    chrome.storage.sync.set({ highlightEnabled: isEnabled });
}
