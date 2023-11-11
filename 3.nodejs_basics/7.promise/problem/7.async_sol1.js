// const fs = require('fs').promises; // 구버전 방식
const fs = require('fs/promises');

// 비동기적으로 파일 읽기를 Promise로 처리
const readAndSortFile = async () => {
    try {
        const data = await fs.readFile('file.txt', 'utf8');
        const numbers = data.split('\n').map(Number);
        const sortedNumbers = numbers.sort((a, b) => a - b);

        console.log(sortedNumbers);
        console.log('비동기 작업 완료');
    } catch (err) {
        console.error(err);
    }
};

// readAndSortFile 함수를 호출하고 작업이 완료된 후에 "다음 작업"을 출력
readAndSortFile().then(() => {
    console.log('다음 작업');
});
