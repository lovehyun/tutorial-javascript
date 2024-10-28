const { readCSV, writeCSV } = require('./4.my-csv-library');

// 예제 데이터
const sampleData = [
    ['이름', '생년월일', '성별'], // Header
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

console.log("쓰기 시작");
// CSV 파일 쓰기
writeCSV(filePath, sampleData, (err) => {
    if (err) {
        console.error('CSV 파일 쓰기 실패:', err);
        return;
    }

    console.log('데이터가 성공적으로 CSV 파일에 쓰여졌습니다.');
});
console.log("쓰기 완료");


console.log("읽기 시작");
// CSV 파일 읽기
readCSV(filePath, (err, data) => {
    if (err) {
        console.error('CSV 파일 읽기 실패:', err);
        return;
    }

    console.log('CSV 파일 내용:', data);
});
console.log("읽기 완료");
