const fs = require('fs');

const filePath = 'sample.csv';

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('파일을 읽는 도중 오류가 발생했습니다:', err);
        return;
    }

    // console.log(data);

    const rows = data.split('\n');

    // 1. for loop 방식
    // for (let i = 0; i < rows.length; i++) {
    //     // console.log(rows[i]);
    //     const row = rows[i];
    //     const columns = row.split(',');
    //     console.log(`행 ${i+1}:`, columns);
    // }

    // 2. forEach 방식
    // rows.forEach((row, i) => {
    //     const columns = row.split(',');
    //     console.log(`행 ${i+1}:`, columns);
    // });

    // 각 행을 처리하거나 원하는 방식으로 데이터 활용
    rows.forEach((row, index) => {
        const columns = row.split(',');
        console.log(`행 ${index + 1}:`, columns);
    });
});
