// 이전 라이브러리 파일에서...
// module.exports = { readCSV, writeCSV };

const { readCSV, writeCSV } = require('./my-csv-library');

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

// 샘플 데이터를 100번 반복해서 추가 (타이틀을 제외한 10개의 데이터만 반복)
const repeatedData = Array.from({ length: 100 }, (_, index) => (index === 0 ? sampleData[0] : sampleData[index % 10]));

console.log("쓰기 시작");
// CSV 파일 쓰기
writeCSV(filePath, repeatedData, (err) => {
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
