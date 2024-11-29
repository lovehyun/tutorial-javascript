document.addEventListener('DOMContentLoaded', () => {
    const consentCookie = getCookie('userConsent');
    
    if (consentCookie === 'accepted') {
        // 24시간 동안 완전 동의 모드 유지
        document.getElementById('interaction-area').style.display = 'block';
        document.getElementById('consent-banner').style.display = 'none';
        enableFullFunctionality(true);
    } else {
        // 매번 동의 배너 표시
        document.getElementById('consent-banner').style.display = 'block';
        document.getElementById('interaction-area').style.display = 'none';
    }
});

// 동의 버튼 이벤트
document.getElementById('accept-button').addEventListener('click', () => {
    // 24시간 동의 쿠키 설정
    const consentTime = new Date().toISOString();
    setCookie('userConsent', 'accepted', 1);
    setCookie('consentTime', consentTime, 1);

    // 모든 사용자 정보 수집
    setCookie('userAgent', navigator.userAgent, 1);
    setCookie('language', navigator.language, 1);
    setCookie('screenResolution', `${window.screen.width}x${window.screen.height}`, 1);

    document.getElementById('interaction-area').style.display = 'block';
    document.getElementById('consent-banner').style.display = 'none';
    enableFullFunctionality(true);
});

// 거부 버튼 이벤트
document.getElementById('decline-button').addEventListener('click', () => {
    // 모든 쿠키 삭제 (페이지 새로고침 시 다시 물어보도록)
    deleteCookie('userConsent');
    deleteCookie('consentTime');
    deleteCookie('userAgent');
    deleteCookie('language');
    deleteCookie('screenResolution');

    document.getElementById('interaction-area').style.display = 'block';
    document.getElementById('consent-banner').style.display = 'none';
    enableFullFunctionality(false);
});

// 전체 기능 활성화 함수
function enableFullFunctionality(isTracking) {
    document.querySelectorAll('.trackable').forEach((button) => {
        // 기능은 정상 작동
        button.addEventListener('click', (e) => {
            // 추적 허용 시에만 데이터 수집
            if (isTracking) {
                const rawClickActivity = getCookie('clickActivity') || '[]';
                const clickActivity = JSON.parse(decodeURIComponent(rawClickActivity));
                clickActivity.push({
                    elementId: e.target.dataset.id,
                    timestamp: new Date().toISOString(),
                });
                setCookie('clickActivity', encodeURIComponent(JSON.stringify(clickActivity)), 1);
            }
            
            // 클릭 기능은 정상 동작
            console.log(`Button clicked: ${e.target.dataset.id}`);
        });
    });
}

// 쿠키 읽기
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// 쿠키 저장
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000); // 24시간 유지
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Strict; Secure`;
}

// 쿠키 삭제
function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
