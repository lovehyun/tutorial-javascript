// 단어를 저장소에서 가져오는 함수
function getStoredWords(callback) {
    chrome.storage.sync.get({ words: [] }, (data) => {
        callback(data.words);
    });
}

// 텍스트 노드에만 하이라이트 적용
function applyHighlightToTextNode(node, regex) {
    const parentNode = node.parentNode;
    const frag = document.createDocumentFragment();

    let lastIndex = 0;
    let match;

    while ((match = regex.exec(node.nodeValue)) !== null) {
        const matchedText = match[0];

        // 기존 텍스트 부분을 잘라서 추가
        if (match.index > lastIndex) {
            frag.appendChild(document.createTextNode(node.nodeValue.slice(lastIndex, match.index)));
        }

        // 하이라이트된 부분을 span 태그로 감싸서 추가
        const highlightSpan = document.createElement('span');
        highlightSpan.style.backgroundColor = 'yellow';
        highlightSpan.textContent = matchedText;
        frag.appendChild(highlightSpan);

        lastIndex = regex.lastIndex;
    }

    // 마지막으로 남은 텍스트 추가
    if (lastIndex < node.nodeValue.length) {
        frag.appendChild(document.createTextNode(node.nodeValue.slice(lastIndex)));
    }

    // 원래 텍스트 노드를 새로운 하이라이트된 노드로 교체
    parentNode.replaceChild(frag, node);
}

// 하이라이트 적용 함수 #1. 전체 HTML 코드에서 정규표현식으로 치환
// function applyHighlight(words) {
//     const regex = new RegExp(`\\b(${words.join('|')})\\b`, 'gi');
//     document.body.innerHTML = document.body.innerHTML.replace(regex, (matched) => {
//         return `<span style="background-color: yellow;">${matched}</span>`;
//     });
// }

// 하이라이트 적용 함수 #2. DOM 탐색하여 텍스트 노드에만 하이라이트 적용
function applyHighlight(words) {
    const regex = new RegExp(`\\b(${words.join('|')})\\b`, 'gi');

    function walk(node) {
        let child, next;

        switch (node.nodeType) {
            case 1: // ELEMENT_NODE
                if (node.tagName.toLowerCase() === 'script' || node.tagName.toLowerCase() === 'style') {
                    return; // script, style 태그는 무시
                }
                for (child = node.firstChild; child; child = next) {
                    next = child.nextSibling;
                    walk(child);
                }
                break;

            case 3: // TEXT_NODE
                if (node.nodeValue.trim() !== '') {
                    applyHighlightToTextNode(node, regex);
                }
                break;
        }
    }

    walk(document.body); // body를 기준으로 DOM을 탐색
}

// 하이라이트 제거 함수 (페이지 리로드로 제거)
function removeHighlight() {
    window.location.reload();
}

// 메시지 수신 시 하이라이트 상태에 따라 적용/제거 결정
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.highlightEnabled) {
        // 하이라이트를 켜는 경우
        getStoredWords((words) => {
            if (words.length > 0) {
                applyHighlight(words);
            }
        });
    } else {
        // 하이라이트를 끄는 경우
        removeHighlight();
    }

    // TODO
    // if (request.action === 'updateHighlight') {
    //     // 새로운 단어 목록을 가져와서 하이라이트 적용
    //     getStoredWords((words) => {
    //         applyHighlight(words);
    //     });
    // }
});

// 페이지가 로드될 때 현재 하이라이트 상태에 맞게 적용
chrome.storage.sync.get({ highlightEnabled: true }, (data) => {
    if (data.highlightEnabled) {
        console.log("Word Highlighter - Content script running...");

        // 하이라이트가 켜져 있는 상태라면 적용
        getStoredWords((words) => {
            if (words.length > 0) {
                applyHighlight(words);
            }
        });
    }
});
