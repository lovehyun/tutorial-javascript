process.stdout.write("메시지를 입력하세요: ");
process.stdin.on('data', (data) => {
    console.log(`입력된 메시지: ${data.toString().trim()}`);
    process.exit(); // 입력을 받으면 프로세스를 종료
});
