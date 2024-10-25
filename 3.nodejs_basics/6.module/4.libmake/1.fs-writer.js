const fs = require('fs');

const filePath = 'sample.csv';

const dataToWrite = [ // 예, 온도, 습도
    ['Column 1', 'Column 2'],
    ['값1', '값2'],
    ['값3', '값4'],
    ['값5', '값6'],
    // 추가 데이터 정의
];

const csvContent = dataToWrite.map((row) => row.join(',')).join('\n');

// for 루프 방식
// let csvContent = '';
// for (let i = 0; i < dataToWrite.length; i++) {
//     console.log(dataToWrite[i]);
//     csvContent += dataToWrite[i].join(',');
//     if (i < dataToWrite.length - 1) {
//         csvContent += '\n';
//     }
//     console.log(csvContent);
// }

fs.writeFile(filePath, csvContent, 'utf8', (err) => {
    if (err) {
        console.error('파일을 쓰는 도중 오류가 발생했습니다:', err);
        return;
    }

    console.log('CSV 파일이 성공적으로 작성되었습니다.');
});
