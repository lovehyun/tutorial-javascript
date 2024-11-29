document.getElementById('accept-button').addEventListener('click', () => {
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const clickActivity = [];
    const consentTime = new Date().toISOString(); // 동의 시간을 추가

    document.getElementById('interaction-area').style.display = 'block';
    document.getElementById('consent-banner').style.display = 'none';

    document.querySelectorAll('.trackable').forEach((button) => {
        button.addEventListener('click', (e) => {
            clickActivity.push({
                elementId: e.target.dataset.id,
                timestamp: new Date().toISOString(),
            });
        });
    });

    window.addEventListener('beforeunload', () => {
        fetch('/api/collect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userAgent, language, screenResolution, clickActivity, consentTime }),
        });
    });
});

document.getElementById('decline-button').addEventListener('click', () => {
    alert('You declined cookies. Limited functionality enabled.');
    document.getElementById('consent-banner').style.display = 'none';
});
