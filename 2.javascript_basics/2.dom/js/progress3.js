document.addEventListener("DOMContentLoaded", () => {
    const timeInput    = document.getElementById("timeInput");
    const startButton  = document.getElementById("startButton");
    const resetButton  = document.getElementById("resetButton");
    const progressBar  = document.getElementById("progress");
    const progressText = document.getElementById("progressText");

    let intervalId = null; // 타이머 ID (null이면 멈춤 상태)
    let duration   = 0;    // 전체 시간(초)
    let elapsed    = 0;    // 경과 시간(초)

    // 진행률 UI 업데이트
    function renderProgress() {
        const percent = duration > 0 ? (elapsed / duration) * 100 : 0;
        const ratio = Math.min(percent, 100);
        progressBar.style.width = `${ratio}%`;
        progressText.textContent = `${Math.floor(ratio).toFixed(2)}%`;
    }

    // 타이머 정지 (일시정지/완료 공통)
    function stopTimer() {
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
        }
        startButton.textContent = "Start";
    }

    // 타이머 완전 리셋
    function resetAll() {
        stopTimer();
        duration = 0;
        elapsed = 0;
        timeInput.disabled = false;
        timeInput.value = "";
        renderProgress();
    }

    // 타이머 시작 or 재시작
    function startTimer() {
        // 이미 돌고 있으면 무시
        if (intervalId !== null) return;

        // duration 이 없거나, 끝난 상태라면 새로 세팅
        if (!duration || elapsed === 0 || elapsed >= duration) {
            const value = Number(timeInput.value);
            if (!value || value <= 0) {
                alert("Please enter a valid number of seconds.");
                return;
            }
            duration = value;
            elapsed = 0;
            renderProgress();
        }

        timeInput.disabled = true;
        startButton.textContent = "Stop";

        intervalId = setInterval(() => {
            elapsed += 1;
            renderProgress();

            if (elapsed >= duration) {
                stopTimer();
                timeInput.disabled = false; // 끝나면 다시 입력 가능
            }
        }, 1000);
    }

    // Start 버튼 클릭 시: 시작/정지 토글
    startButton.addEventListener("click", () => {
        if (intervalId === null) {
            // 멈춤 상태 → 시작/재시작
            startTimer();
        } else {
            // 실행 중 → 일시정지
            stopTimer();
        }
    });

    // Reset 버튼 클릭 시: 완전 초기화
    resetButton.addEventListener("click", resetAll);

    // 처음 로딩 시 UI 초기화
    resetAll();
});
