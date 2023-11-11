const fs = require('fs');

// 파일에 랜덤 데이터 생성
const generateRandomData = (count) => {
    let data = '';
    for (let i = 0; i < count; i++) {
        data += `${Math.floor(Math.random() * 1000000)}\n`;
    }
    return data;
};

// 파일 쓰기
fs.writeFile('file.txt', generateRandomData(10000), 'utf8', (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('file.txt 파일이 생성되었습니다.');
});
