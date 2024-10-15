document.addEventListener('DOMContentLoaded', () => {
    const dot = document.getElementById('dot');
    const scoreDisplay = document.getElementById('score');
    const gameArea = document.getElementById('gameArea');
    let score = 0;

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

    // 점을 클릭할 때마다 점수 증가 및 점 이동
    dot.addEventListener('click', () => {
        score++;
        scoreDisplay.textContent = score;
        moveDot();
    });

    // 게임 시작 시 첫 위치로 점 이동
    moveDot();
});
