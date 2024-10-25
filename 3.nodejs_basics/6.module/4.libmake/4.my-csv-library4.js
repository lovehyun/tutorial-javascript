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

module.exports = { readCSV, writeCSV };
