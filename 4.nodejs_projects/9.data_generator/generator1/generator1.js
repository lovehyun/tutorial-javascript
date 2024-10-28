const names = ['John', 'Jane', 'Michael', 'Emily', 'William', 'Olivia'];
const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Philadelphia'];

function generateName() {
    return names[Math.floor(Math.random() * names.length)];
}

function generateGender() {
    return Math.random() < 0.5 ? 'Male' : 'Female';
}

// ------------------
// 평범한 방법
function generateBirthdate() {
    const year = Math.floor(Math.random() * (2005 - 1970 + 1)) + 1970;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

// 나쁜 방법
function generateYearBAD() {
    let randomYear;
    while (true) {
        randomYear = Math.floor(Math.random() * 10000)
        console.log(`Generated: ${randomYear}`);
        if (randomYear >= 1970 && randomYear <= 2005) {
            break; // 범위에 들어오면 반복 종료
        }
    }
    return randomYear;
}

// 함수 만들기
function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 좋은 방법
function generateBirthdateGOOD() {
    const year = getRandomInRange(1970, 2005);
    const month = getRandomInRange(1, 12);
    const day = getRandomInRange(1, 28); // 일 수를 28로 제한하여 모든 달에 유효한 일 생성
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}
// ------------------

function generateAddress() {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const street = Math.floor(Math.random() * 100) + 1;
    return `${street} ${city}`;
}

const data = [];
for (let i = 0; i < 10; i++) {
    const name = generateName();
    const birthdate = generateBirthdate();
    const gender = generateGender();
    const address = generateAddress();
    data.push([name, birthdate, gender, address]);
}

for (const d of data) {
    console.log(d);
}


/*
// CSV 파일 생성
const fs = require('fs');

function writeDataToCSV(data, filePath) {
    const rows = data.map(row => row.join(","));
    const csvContent = rows.join('\n');

    fs.writeFileSync(filePath, csvContent, 'utf8');
}

function writeDataToCSV(data, filePath) {
    const headers = "Name,Birthdate,Gender,Address"; // CSV 헤더
    const rows = data.map(row => row.join(",")); // 각 데이터를 CSV 형식으로 변환
    const csvContent = [headers, ...rows].join("\n"); // 헤더와 데이터 결합
    
    fs.writeFileSync(filePath, csvContent, 'utf8');
    console.log(`Data has been written to ${filePath}`);
}

// CSV 파일 작성 호출
writeDataToCSV(data, "output.csv");
*/
