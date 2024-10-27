console.log("시작");

process.nextTick(() => {
    console.log("다음 틱에서 실행");
});

setImmediate(() => {
    console.log("Immediate에서 실행");
});

console.log("끝");
