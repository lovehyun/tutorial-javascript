console.log("작업을 시작합니다.");

setTimeout(() => {
    console.log("첫 번째 작업 완료 (2초 후)");
}, 2000);

setTimeout(() => {
    console.log("두 번째 작업 완료 (1초 후)");
}, 1000);

console.log("모든 타이머가 설정되었습니다.");
