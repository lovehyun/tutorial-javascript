// npm install csv-parser
const fs = require('fs');
const csv = require('csv-parser');

const results = [];

fs.createReadStream('example.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        console.log(results);
        // 결과를 활용한 작업을 여기에서 수행합니다.
    });
