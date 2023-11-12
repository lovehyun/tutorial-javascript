const fs = require('fs');

const filePath = 'sample.csv';

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('파일을 읽는 도중 오류가 발생했습니다:', err);
        return;
    }

    const rows = data.split('\n');

    // 각 행을 처리하거나 원하는 방식으로 데이터 활용
    rows.forEach((row, index) => {
        const columns = row.split(',');
        console.log(`행 ${index + 1}:`, columns);
    });
});
