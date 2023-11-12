const fs = require('fs');

// CSV 파일을 읽어서 데이터를 반환하는 함수 (Promise 버전)
function readCSV(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('파일을 읽는 도중 오류가 발생했습니다:', err);
                return reject(err);
            }

            const rows = data.split('\n');
            const result = rows.map((row) => row.split(','));

            resolve(result);
        });
    });
}

// 데이터를 받아 CSV 파일에 쓰는 함수 (Promise 버전)
function writeCSV(filePath, dataToWrite) {
    return new Promise((resolve, reject) => {
        const csvContent = dataToWrite.map((row) => row.join(',')).join('\n');

        let currentIndex = 0;

        function writeLine() {
            if (currentIndex < dataToWrite.length) {
                const line = dataToWrite[currentIndex].join(',');
                fs.appendFile(filePath, line + '\n', 'utf8', (err) => {
                    if (err) {
                        console.error('파일을 쓰는 도중 오류가 발생했습니다:', err);
                        return reject(err);
                    }

                    currentIndex++;
                    setTimeout(writeLine, 10);
                });
            } else {
                resolve();
            }
        }

        writeLine();
    });
}

// 예제 데이터
const sampleData = [
    ['이름', '생년월일', '성별'],
    ['김수현', '19900101', '남'],
    ['송혜교', '19951231', '여'],
    ['이병헌', '19870415', '남'],
    ['전지현', '19981122', '여'],
    ['현빈', '20001005', '남'],
    ['한지민', '19920518', '여'],
    ['이정재', '19860307', '남'],
    ['김태리', '19971203', '여'],
    ['조인성', '20010820', '남'],
    ['전혜빈', '19930910', '여'],
];

// CSV 파일 경로
const filePath = 'user.csv';

async function main() {
    console.log("비동기/동기 코드 시작")

    try {
        // CSV 파일 쓰기 (Promise)
        console.log("쓰기 시작");
        await writeCSV(filePath, sampleData);
        console.log('데이터가 성공적으로 CSV 파일에 쓰여졌습니다.');
        console.log("쓰기 종료");

        console.log("읽기 시작");
        // CSV 파일 읽기 (Promise)
        const data = await readCSV(filePath);
        console.log('CSV 파일 내용:', data);
        console.log("읽기 종료");
    } catch (err) {
        console.error('오류 발생:', err);
    } finally {
        console.log("작업 완료");
    }
    console.log("비동기/동기 코드 종료")
}

main();
