document.addEventListener("DOMContentLoaded", function () {
    const timeInput = document.getElementById("timeInput");
    const startButton = document.getElementById("startButton");
    const resetButton = document.getElementById("resetButton");
    const progressBar = document.getElementById("progress");
    const progressText = document.getElementById('progressText');

    let interval;
    let duration;

    // 진행률 초기화 함수
    function resetProgressBar() {
        if (interval) clearInterval(interval);
        progressBar.style.width = "0%";
        progressText.textContent = "0%";
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
    function updateProgress(elapsed) {
        const ratio = (elapsed / duration) * 100;
        progressBar.style.width = `${ratio}%`;
        progressText.textContent = `${Math.floor(ratio)}%`;
    }

    // 타이머 진행 함수
    function startProgress() {
        resetProgressBar();

        if (!validateTimeInput()) return; // 입력값이 유효하지 않으면 실행 중지

        let timePassed = 0;

        interval = setInterval(() => {
            timePassed++;
            updateProgress(timePassed);

            if (timePassed >= duration) {
                clearInterval(interval);
            }
        }, 1000); // 1초마다 실행
    }

    // 이벤트 핸들러 함수
    function attachEventListeners() {
        startButton.addEventListener("click", startProgress);
        resetButton.addEventListener("click", resetProgressBar);
    }

    // 초기화 함수
    function init() {
        resetProgressBar();
        attachEventListeners();
    }

    init(); // 초기화 함수 실행
});
