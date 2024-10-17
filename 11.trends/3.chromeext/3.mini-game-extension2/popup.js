document.addEventListener('DOMContentLoaded', () => {
    const dot = document.getElementById('dot');
    const scoreDisplay = document.getElementById('score');
    const levelDisplay = document.getElementById('level');
    const gameArea = document.getElementById('gameArea');
    
    let score = 0;
    let level = 1;
    let clicksInCurrentLevel = 0; // 현재 레벨에서 클릭한 횟수
    let moveInterval = 1000;  // 처음에는 1초
    let intervalId;

    const pointsPerLevel = {
        1: 10,
        2: 20,
        3: 30,
        4: 40,
        5: 50
    };

    // 게임 영역 내에서 랜덤한 위치에 점을 이동시키는 함수
    function moveDot() {
        const gameAreaWidth = gameArea.clientWidth;
        const gameAreaHeight = gameArea.clientHeight;
        const dotSize = dot.clientWidth;

        const randomX = Math.floor(Math.random() * (gameAreaWidth - dotSize));
        const randomY = Math.floor(Math.random() * (gameAreaHeight - dotSize));

        dot.style.left = `${randomX}px`;
        dot.style.top = `${randomY}px`;
    }

    // 점수를 추가하는 함수 (레벨별로 점수 상승)
    function updateScore() {
        score += pointsPerLevel[level];
        scoreDisplay.textContent = score;
    }

    // 레벨을 업데이트하는 함수
    function updateLevel() {
        clicksInCurrentLevel++;

        // 5번 클릭할 때마다 레벨을 올림
        if (clicksInCurrentLevel === 5) {
            level++;
            clicksInCurrentLevel = 0;  // 클릭 횟수 초기화
            levelDisplay.textContent = level;

            // 레벨이 올라갈수록 이동 주기가 짧아짐 (최소 200ms)
            moveInterval = Math.max(200, moveInterval - 200);

            // 기존 타이머 제거하고 새로운 주기로 타이머 설정
            clearInterval(intervalId);
            intervalId = setInterval(moveDot, moveInterval);
        }
    }

    // 클릭할 때마다 기존 타이머를 초기화하고 새로운 타이머를 설정
    function resetTimer() {
        clearInterval(intervalId); // 기존 타이머 제거
        intervalId = setInterval(() => {
            moveDot(); // 일정 시간이 지나면 다시 이동
        }, moveInterval); // 현재 레벨에 따른 이동 주기로 타이머 설정
    }

    // 점을 클릭할 때마다 점수와 레벨 증가 및 점 이동
    dot.addEventListener('click', () => {
        updateScore();
        updateLevel();
        moveDot();
        resetTimer(); // 타이머 초기화 및 재설정
    });

    // 게임 시작 시 처음 1초마다 점 이동
    intervalId = setInterval(moveDot, moveInterval);
});
