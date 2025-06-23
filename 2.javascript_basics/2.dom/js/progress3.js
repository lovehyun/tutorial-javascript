document.addEventListener("DOMContentLoaded", function () {
    const timeInput = document.getElementById("timeInput");
    const startButton = document.getElementById("startButton");
    const resetButton = document.getElementById("resetButton");
    const progressBar = document.getElementById("progress");
    const progressText = document.getElementById('progressText');

    let interval;
    let duration;
    let timePassed = 0; // 현재까지 진행된 시간
    let isRunning = false; // 타이머 실행 여부

    // 진행률 초기화 함수
    function resetProgressBar() {
        if (interval) clearInterval(interval);
        progressBar.style.width = "0%";
        progressText.textContent = "0%";
        timePassed = 0;
        isRunning = false;
        startButton.textContent = "Start";
        timeInput.disabled = false;
    }

    // 유효성 검사 함수
    function validateTimeInput() {
        duration = parseInt(timeInput.value);
        if (isNaN(duration) || duration <= 0) {
            alert("Please enter a valid number of seconds.");
            return false;
        }
        return true;
    }

    // 진행률 업데이트 함수
    function updateProgress() {
        const progress = (timePassed / duration) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${Math.floor(progress)}%`;
    }

    // 타이머 시작 함수
    function startProgress() {
        if (!validateTimeInput()) return;

        isRunning = true;
        startButton.textContent = "Stop";
        timeInput.disabled = true;

        interval = setInterval(() => {
            timePassed++;
            updateProgress();

            if (timePassed >= duration) {
                clearInterval(interval);
                isRunning = false;
                startButton.textContent = "Start";
                timeInput.disabled = false;
            }
        }, 1000);
    }

    // 타이머 일시정지 함수
    function stopProgress() {
        clearInterval(interval);
        isRunning = false;
        startButton.textContent = "Start";
    }

    // 토글 함수
    function toggleProgress() {
        if (!isRunning) {
            startProgress();
        } else {
            stopProgress();
        }
    }

    // 이벤트 핸들러 함수
    function attachEventListeners() {
        startButton.addEventListener("click", toggleProgress);
        resetButton.addEventListener("click", resetProgressBar);
    }

    // 초기화 함수
    function init() {
        resetProgressBar();
        attachEventListeners();
    }

    init(); // 초기화 함수 실행
});
