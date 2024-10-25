// npm install csv-writer

// 모듈 전체 중 특정 함수만 가져옴
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
    path: 'example.csv',
    header: [
        // 헤더 정의
        { id: 'column1', title: 'Column 1' },
        { id: 'column2', title: 'Column 2' },
        // 추가 필요한 헤더 정의
    ],
});

const data = [
    { column1: '값1', column2: '값2' },
    // 추가 데이터 정의
];

csvWriter.writeRecords(data).then(() => console.log('CSV 파일이 성공적으로 작성되었습니다.'));
