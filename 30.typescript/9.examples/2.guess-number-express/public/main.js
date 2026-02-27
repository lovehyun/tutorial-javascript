// public/main.js

const startBtn = document.getElementById('start-btn');
const guessBtn = document.getElementById('guess-btn');
const guessInput = document.getElementById('guess-input');
const logDiv = document.getElementById('log');

function addLog(message) {
    logDiv.innerText += message + '\n';
}

startBtn.addEventListener('click', async () => {
    const res = await fetch('/api/game/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    logDiv.textContent = ''; // 로그 초기화
    addLog(`🎯 게임이 시작되었습니다. 최대 시도 횟수: ${data.maxAttempts}`);
});

guessBtn.addEventListener('click', async () => {
    const value = Number(guessInput.value);
    if (Number.isNaN(value)) {
        addLog('❌ 숫자를 입력하세요.');
        return;
    }

    const res = await fetch('/api/game/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guess: value }),
    });

    if (!res.ok) {
        const err = await res.json();
        addLog('에러: ' + (err.error || '알 수 없는 오류'));
        return;
    }

    const data = await res.json();
    addLog(`입력: ${value} → ${data.result} (시도: ${data.attempts}/${data.maxAttempts})`);

    if (data.finished) {
        addLog(`🎉 게임 종료! 정답은 ${data.target}였습니다.`);
    }
});
