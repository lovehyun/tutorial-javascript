// process.argv 사용 예제
const args = process.argv.slice(2); // 첫 두 개는 node와 파일 경로이므로 제외

if (args.length === 0) {
    console.log("인수가 없습니다.");
} else {
    console.log("명령줄 인수:");
    args.forEach((arg, index) => {
        console.log(`인수 ${index + 1}: ${arg}`);
    });
}
