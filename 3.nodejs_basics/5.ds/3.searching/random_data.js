// 랜덤으로 10만개의 숫자 생성
const array = Array.from({ length: 100000 }, () => Math.floor(Math.random() * 100000));


// 랜덤으로 10만개의 숫자 겹치지 않게 생성
const uniqueRandomNumbers = new Set();

while (uniqueRandomNumbers.size < 100000) {
    uniqueRandomNumbers.add(Math.floor(Math.random() * 100000));
}

const arrayOfUniqueNumbers = Array.from(uniqueRandomNumbers);
console.log(arrayOfUniqueNumbers);


// Set() 을 사용하지 않고, for 구문을 통해 직접 하면?
const nonUniqueRandomNumbers = Array.from({ length: 100000 }, () => Math.floor(Math.random() * 100000));

const uniqueRandomNumbers2 = [];

for (let i = 0; i < nonUniqueRandomNumbers.length; i++) {
    let randomNumber = nonUniqueRandomNumbers[i];

    if (!uniqueRandomNumbers.includes(randomNumber)) {
        uniqueRandomNumbers.push(randomNumber);
    } else {
        while (uniqueRandomNumbers.includes(randomNumber)) {
            randomNumber = Math.floor(Math.random() * 100000);
        }
        uniqueRandomNumbers.push(randomNumber);
    }
}

console.log(uniqueRandomNumber2);
