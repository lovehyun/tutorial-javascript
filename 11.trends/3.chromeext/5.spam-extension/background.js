chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'checkSpam') {
        // 수동 체크: content.js로 className 전달
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'extractEmailContent', className: message.className }, (response) => {
                sendResponse(response);
            });
        });
        return true; // 비동기 응답을 처리하기 위해 true 반환
    }
});
