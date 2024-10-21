// Array 의 내장함수
// 배열에 관련된 메서드들이 매우 유용합니다.
// - map(): 배열의 각 요소를 변환하여 새 배열을 반환합니다.
// - filter(): 조건을 만족하는 요소들로 새 배열을 만듭니다.
// - reduce(): 배열의 모든 요소를 하나의 값으로 축약합니다.
// - forEach(): 배열의 각 요소에 대해 함수를 실행합니다.

// 1.필터
// function aboveTwentyCondition(n) {
//     if (n > 20) {
//         return true;
//     } else {
//         return false;
//     }
// }
// const aboveTwenty = numbers.filter(aboveTwentyCondition);

const numbers = [10, 15, 20, 25, 30];
const aboveTwenty = numbers.filter(num => num > 20);
console.log(aboveTwenty); // [25, 30]


// 2. 짝수만 필터링
const numbers2 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const evenNumbers = numbers2.filter(num => num % 2 === 0);
console.log(evenNumbers);  // 출력: [2, 4, 6, 8]


// 3. 특정 문자열을 필터링
const words = ["apple", "banana", "grape", "blueberry", "avocado"];
const containsA = words.filter(word => word.includes('a'));
console.log(containsA);  // 출력: ['apple', 'banana', 'grape', 'avocado']

// 참고
// function includesA(word) {
//     for (let i = 0; i < word.length; i++) {
//         if (word[i] === 'a') {
//             return true;
//         }
//     }
//     return false;
// }

// const containsA = words.filter(word => includesA(word));


// 4. 객체 배열에서 특정 속성 기준으로 필터링
const people = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 },
    { name: "Charlie", age: 20 },
    { name: "David", age: 35 }
];

const adults = people.filter(person => person.age >= 30);
console.log(adults);  


// 5. 객체 배열에서 특정 키가 존재하는 요소 필터링
const items = [
    { name: "Apple", price: 150 },
    { name: "Banana" },  // price 없음
    { name: "Orange", price: 100 }
];

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
const withPrice = items.filter(item => item.hasOwnProperty('price'));
console.log(withPrice);  


// 6. 빈 문자열 또는 falsy 값 필터링
const mixedArray = [0, "Hello", "", false, 42, null, "World", undefined];
const truthyValues = mixedArray.filter(Boolean);
console.log(truthyValues);  // 출력: ["Hello", 42, "World"]

