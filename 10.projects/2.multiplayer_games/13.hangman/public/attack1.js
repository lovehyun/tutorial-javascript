// 1. a~z 자동 브루트포스 (입력 자동화 공격)
// a~z 자동으로 입력하고 "글자 맞추기" 버튼을 눌러서
// 사람보다 훨씬 빠르게 게임을 푸는 공격 코드
(function () {
    const input  = document.getElementById("letterInput");
    const button = document.getElementById("guessBtn");

    if (!input || !button) {
        console.log("input 또는 button을 찾지 못했습니다.");
        return;
    }

    const letters = "abcdefghijklmnopqrstuvwxyz";
    let index = 0;

    input.focus();

    const timer = setInterval(() => {
        // 모든 알파벳을 다 시도했으면 종료
        if (index >= letters.length) {
            clearInterval(timer);
            console.log("브루트포스 완료");
            return;
        }

        const ch = letters[index];
        input.value = ch;
        button.click();          // 실제로 게임에서 guessLetter() 호출

        console.log("try:", ch);
        index++;
    }, 50); // 50ms 간격: 너무 빠르면 서버/브라우저가 버벅일 수 있어서 적당히 조절
})();
