document.getElementById('accept-button').addEventListener('click', () => {
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const consentTime = new Date().toISOString();

    // 쿠키에 데이터 저장
    document.cookie = `userAgent=${encodeURIComponent(userAgent)}`;
    document.cookie = `language=${encodeURIComponent(language)}`;
    document.cookie = `screenResolution=${encodeURIComponent(screenResolution)}`;
    document.cookie = `consentTime=${encodeURIComponent(consentTime)}`;

    document.getElementById('interaction-area').style.display = 'block';
    document.getElementById('consent-banner').style.display = 'none';
});

document.querySelectorAll('.trackable').forEach((button) => {
    button.addEventListener('click', (e) => {
        const rawClickActivity = getCookie('clickActivity') || '[]'; // Read raw cookie value
        const clickActivity = JSON.parse(decodeURIComponent(rawClickActivity)); // Decode and parse JSON
        clickActivity.push({
            elementId: e.target.dataset.id,
            timestamp: new Date().toISOString(),
        });
        document.cookie = `clickActivity=${encodeURIComponent(JSON.stringify(clickActivity))}`;
    });
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
