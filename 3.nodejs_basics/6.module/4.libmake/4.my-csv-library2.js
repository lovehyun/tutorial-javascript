const fs = require('fs');

// CSV 파일을 읽어서 데이터를 반환하는 함수
function readCSV(filePath, callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('파일을 읽는 도중 오류가 발생했습니다:', err);
            return callback(err, null);
        }

        const rows = data.split('\n');
        const result = rows.map((row) => row.split(','));

        callback(null, result);
    });
}

// 데이터를 받아 CSV 파일에 쓰는 함수
function writeCSV(filePath, dataToWrite, callback) {
    const csvContent = dataToWrite.map((row) => row.join(',')).join('\n');
    // 한 줄씩 처리하도록 setTimeout 사용
    let currentIndex = 0;

    function writeLine() {
        if (currentIndex < dataToWrite.length) {
            const line = dataToWrite[currentIndex].join(',');
            fs.appendFile(filePath, line + '\n', 'utf8', (err) => {
                if (err) {
                    console.error('파일을 쓰는 도중 오류가 발생했습니다:', err);
                    return callback(err);
                }

                currentIndex++;
                setTimeout(writeLine, 10); // 10ms 간격으로 처리
            });
        } else {
            callback(null);
        }
    }

    writeLine();
}

module.exports = { readCSV, writeCSV };
