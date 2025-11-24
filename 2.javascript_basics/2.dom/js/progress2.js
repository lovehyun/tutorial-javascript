document.addEventListener("DOMContentLoaded", function () { // DOM이 완전히 로드된 후 실행
    const timeInput = document.getElementById("timeInput"); // 시간 입력 필드
    const startButton = document.getElementById("startButton"); // 시작 버튼
    const resetButton = document.getElementById("resetButton"); // 리셋 버튼
    const progressBar = document.getElementById("progress"); // 진행률 바
    const progressText = document.getElementById('progressText');

    let interval; // 타이머 인터벌을 저장할 변수

    function startProgress() {
        if (interval) clearInterval(interval); // 기존의 인터벌이 있으면 제거

        duration = parseInt(timeInput.value); // 입력된 시간을 정수로 변환
        if (isNaN(duration) || duration <= 0) { // 유효하지 않은 입력 처리
            alert("Please enter a valid number of seconds."); // 경고 메시지 표시
            return; // 함수 종료
        }

        let elapsed = 0; // 경과된 시간을 초기화
        progressBar.style.width = "0%"; // 진행률 바 초기화

        interval = setInterval(() => { // 1초마다 실행되는 인터벌 설정
            elapsed++; // 경과된 시간 증가
            
            let ratio = (elapsed / duration) * 100; // 진행률 계산
            progressBar.style.width = `${ratio}%`; // 진행률 바 업데이트
            progressText.textContent = Math.floor(ratio) + '%'; // 퍼센트 업데이트

            if (elapsed >= duration) { // 지정된 시간이 경과되면
                clearInterval(interval); // 인터벌 제거
            }
        }, 1000); // 1초 간격으로 실행
    }

    function resetProgress() {
        if (interval) clearInterval(interval); // 기존의 인터벌이 있으면 제거
        progressBar.style.width = "0%"; // 진행률 바 초기화
        timeInput.value = ""; // 입력 필드 초기화
    }

    startButton.addEventListener("click", startProgress); // 시작 버튼 클릭 시 startProgress 함수 실행
    resetButton.addEventListener("click", resetProgress); // 리셋 버튼 클릭 시 resetProgress 함수 실행
});
