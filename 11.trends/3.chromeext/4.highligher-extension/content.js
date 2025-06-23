// 단어를 저장소에서 가져오는 함수
function getStoredWords(callback) {
    chrome.storage.sync.get({ words: [] }, (data) => {
        callback(data.words);
    });
}

// 텍스트 노드에 하이라이트 적용
function applyHighlightToTextNode(node, words) {
    // React가 관리하는 노드인지 다시 한 번 확인
    if (!node.parentNode || !document.contains(node)) {
        return; // 이미 DOM에서 제거된 노드
    }
    
    const parentNode = node.parentNode;
    const originalText = node.nodeValue;
    let modifiedText = originalText;
    let hasChanges = false;
    
    // 각 단어에 대해 하이라이트 적용
    words.forEach(word => {
        const trimmedWord = word.trim();
        if (!trimmedWord) return;
        
        const lowerText = modifiedText.toLowerCase();
        const lowerWord = trimmedWord.toLowerCase();
        
        let startIndex = 0;
        while (true) {
            const index = lowerText.indexOf(lowerWord, startIndex);
            if (index === -1) break;
            
            // 단어 경계 체크
            const beforeChar = index > 0 ? originalText[index - 1] : '';
            const afterChar = index + trimmedWord.length < originalText.length ? 
                              originalText[index + trimmedWord.length] : '';
            
            const wordBoundary = /[^\w가-힣]/;
            const beforeOk = !beforeChar || wordBoundary.test(beforeChar);
            const afterOk = !afterChar || wordBoundary.test(afterChar);
            
            if (beforeOk && afterOk) {
                const actualMatch = originalText.substring(index, index + trimmedWord.length);
                const replacement = `<span class="word-highlighter" style="background-color: yellow; color: black;">${actualMatch}</span>`;
                
                modifiedText = modifiedText.substring(0, index) + replacement + 
                              modifiedText.substring(index + trimmedWord.length);
                hasChanges = true;
                break;
            }
            
            startIndex = index + 1;
        }
    });
    
    // DOM 업데이트 (더 안전하게)
    if (hasChanges) {
        // DOM 변경 전 한 번 더 확인
        if (!document.contains(node) || !node.parentNode) {
            return;
        }
        
        try {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = modifiedText;
            
            const frag = document.createDocumentFragment();
            while (tempDiv.firstChild) {
                frag.appendChild(tempDiv.firstChild);
            }
            
            // DOM 변경 시점에서 한 번 더 확인
            if (parentNode && document.contains(parentNode)) {
                parentNode.replaceChild(frag, node);
            }
        } catch (e) {
            // DOM 충돌 시 조용히 무시
            console.warn('Word Highlighter - DOM 교체 실패, React 충돌 가능성');
        }
    }
}

// DOM 탐색하여 하이라이트 적용
function applyHighlight(words) {
    if (!words || words.length === 0) return;
    
    const validWords = words.filter(word => word && word.trim().length > 0);
    if (validWords.length === 0) return;

    console.log('Word Highlighter - 하이라이트 적용할 단어들:', validWords);

    function walkDOM(node) {
        let child, next;

        switch (node.nodeType) {
            case 1: // ELEMENT_NODE
                const tagName = node.tagName.toLowerCase();
                // React 관련 요소들과 기존 제외 요소들 건너뛰기
                if (tagName === 'script' || tagName === 'style' || 
                    node.classList.contains('word-highlighter') ||
                    node.hasAttribute('data-reactroot') ||
                    node.id && node.id.startsWith('react-') ||
                    node.className && typeof node.className === 'string' && 
                    (node.className.includes('react-') || node.className.includes('_react'))) {
                    return;
                }
                
                // React 컴포넌트나 동적 콘텐츠 영역은 건너뛰기
                for (child = node.firstChild; child; child = next) {
                    next = child.nextSibling;
                    // 안전하게 DOM 변경을 위해 try-catch 추가
                    try {
                        walkDOM(child);
                    } catch (e) {
                        // React DOM 충돌 시 해당 노드는 건너뛰기
                        console.warn('Word Highlighter - DOM 노드 건너뛰기:', e.message);
                    }
                }
                break;

            case 3: // TEXT_NODE
                if (node.nodeValue && node.nodeValue.trim() !== '') {
                    // React가 관리하는 노드인지 확인
                    let parentElement = node.parentElement;
                    let isReactManaged = false;
                    
                    // 부모 요소들을 확인하여 React 관리 여부 판단
                    while (parentElement && !isReactManaged) {
                        if (parentElement.hasAttribute('data-reactroot') ||
                            (parentElement.id && parentElement.id.startsWith('react-')) ||
                            (parentElement.className && typeof parentElement.className === 'string' && 
                             (parentElement.className.includes('react-') || parentElement.className.includes('_react')))) {
                            isReactManaged = true;
                        }
                        parentElement = parentElement.parentElement;
                    }
                    
                    // React가 관리하지 않는 노드만 처리
                    if (!isReactManaged) {
                        try {
                            applyHighlightToTextNode(node, validWords);
                        } catch (e) {
                            // DOM 충돌 시 건너뛰기
                            console.warn('Word Highlighter - 텍스트 노드 처리 실패:', e.message);
                        }
                    }
                }
                break;
        }
    }

    if (document.body) {
        walkDOM(document.body);
    }
}

// 하이라이트 제거
function removeHighlight() {
    const highlightedElements = document.querySelectorAll('span.word-highlighter');
    highlightedElements.forEach((element) => {
        const parent = element.parentNode;
        if (parent) {
            const textNode = document.createTextNode(element.textContent);
            parent.replaceChild(textNode, element);
            parent.normalize();
        }
    });
}

// 메시지 처리
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleHighlight') {
        if (request.highlightEnabled) {
            getStoredWords((words) => {
                if (words.length > 0) {
                    applyHighlight(words);
                }
            });
        } else {
            removeHighlight();
        }
    }

    if (request.action === 'updateHighlight') {
        chrome.storage.sync.get({ highlightEnabled: true }, (data) => {
            removeHighlight();
            if (data.highlightEnabled) {
                getStoredWords((words) => {
                    if (words.length > 0) {
                        applyHighlight(words);
                    }
                });
            }
        });
    }
    
    sendResponse({ success: true });
});

// 초기화
function initHighlighter() {
    chrome.storage.sync.get({ highlightEnabled: true }, (data) => {
        if (data.highlightEnabled) {
            getStoredWords((words) => {
                if (words.length > 0) {
                    applyHighlight(words);
                }
            });
        }
    });
}

// 페이지 로드 시 실행
function initialize() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHighlighter);
    } else {
        setTimeout(initHighlighter, 100);
    }
}

console.log('Word Highlighter - Content script 시작');
initialize();

// SPA 대응 (URL 변화 감지)
let lastUrl = location.href;
let timeoutId = null;

const observer = new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        
        timeoutId = setTimeout(() => {
            initHighlighter();
        }, 500);
    }
});

// DOM 변화 감지 시작
if (document.body) {
    observer.observe(document, { subtree: true, childList: true });
} else {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.body) {
            observer.observe(document, { subtree: true, childList: true });
        }
    });
}
