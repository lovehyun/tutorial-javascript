// 자동 체크 로직 - 페이지가 로드된 후 특정 클래스명을 기반으로 이메일 본문 자동 추출
// 네이버 className: mail_view_header, mail_view_contents
const autoClassName = 'mail_view_header'; // 자동으로 체크할 클래스명

// 수동 체크 로직 - 전달받은 className 으로 검색
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'extractEmailContent') {
        const className = message.className || autoClassName; // 받은 className이 없으면 autoClassName 사용

        const emailElement = document.querySelector(`.${className}`);
        if (emailElement) {
            const emailContent = emailElement.innerText;
            sendResponse({ emailContent: emailContent });
        } else {
            console.error("No element found with the given class name.");
            sendResponse({ emailContent: null });
        }
    }
});
