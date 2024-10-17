document.getElementById('addWord').addEventListener('click', addWord);
document.getElementById('wordInput').addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        addWord();
    }
});

function addWord() {
    const wordInput = document.getElementById('wordInput');
    const word = wordInput.value.trim();

    if (word) {
        getStoredWords((words) => {
            if (!words.includes(word)) {
                words.push(word);
                // setStoredWords(words, updateWordList);
                setStoredWords(words, () => {
                    updateWordList();

                    // 새 단어가 추가될 때마다 content.js로 메시지 전송
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        chrome.tabs.sendMessage(tabs[0].id, { action: 'updateHighlight' });
                    });

                    wordInput.value = ''; // clear input
                });
            }
        });
    }
}

document.getElementById('toggleHighlight').addEventListener('change', (event) => {
    const isEnabled = event.target.checked;
    setHighlightStatus(isEnabled);

    // 현재 활성 탭에 메시지를 전송하여 하이라이트 상태를 전달
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { highlightEnabled: isEnabled });
    });
});

// Update word list and highlight status when popup is opened
updateWordList();
getHighlightStatus((isEnabled) => {
    document.getElementById('toggleHighlight').checked = isEnabled;
});

function updateWordList() {
    getStoredWords((words) => {
        const wordList = document.getElementById('wordList');
        wordList.innerHTML = ''; // clear the list
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

function removeWord(wordToRemove) {
    getStoredWords((words) => {
        const updatedWords = words.filter((word) => word !== wordToRemove);
        // setStoredWords(updatedWords, updateWordList);
        setStoredWords(updatedWords, () => {
            updateWordList();

            // 단어가 삭제되었을 때도 content.js로 메시지 전송
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'updateHighlight' });
            });
        });
    });
}

// Utility functions for storage and highlighting

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
        console.log('Highlight status loaded:', data.highlightEnabled);
        callback(data.highlightEnabled);
    });
}

function setHighlightStatus(isEnabled) {
    chrome.storage.sync.set({ highlightEnabled: isEnabled }, () => {
        console.log('Highlight status saved:', isEnabled);
    });
}
