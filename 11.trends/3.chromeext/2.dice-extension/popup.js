document.addEventListener('DOMContentLoaded', () => {
    const dice = document.getElementById('dice');
    const rollButton = document.getElementById('rollButton');
    const resultText = document.getElementById('resultText');

    // 주사위를 굴리는 함수
    function rollDice() {
        dice.classList.add('roll');

        // 1초 후에 주사위 결과를 보여줌 (애니메이션 시간과 일치)
        setTimeout(() => {
            const diceNumber = Math.floor(Math.random() * 6) + 1; // 1 ~ 6 랜덤 숫자
            dice.src = `dice${diceNumber}.png`; // 해당 주사위 이미지로 변경
            resultText.textContent = `You rolled a ${diceNumber}!`;
            dice.classList.remove('roll'); // 애니메이션 효과 초기화
        }, 1000);
    }

    // 버튼 클릭 시 주사위 굴리기
    rollButton.addEventListener('click', rollDice);
});
