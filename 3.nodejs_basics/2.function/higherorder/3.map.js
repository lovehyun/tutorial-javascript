// map() 함수는 배열의 각 요소에 대해 주어진 콜백 함수를 호출하여 새로운 배열을 생성합니다.
// 기존 배열의 각 요소를 변환하여 새로운 배열을 반환합니다.

// 1. 맵 기본 (더블 등)
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((num) => num * 2);
console.log(doubled);  // 출력: [2, 4, 6, 8, 10]

const squaredNumbers = numbers.map((num) => num * num);
console.log(squaredNumbers);  // 출력: [1, 4, 9, 16, 25]


// 참고
function squareNumber(num) {
    return num * num;
}

const sqrNumbers = numbers.map(squareNumber);


// 2. 객체 배열에서 특정 속성만 추출
const people = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 },
    { name: "Charlie", age: 20 }
];

const names = people.map(person => person.name);
console.log(names);  // 출력: ['Alice', 'Bob', 'Charlie']


// 3. HTML 태그 생성
const fruits = ["apple", "banana", "grape"];
const htmlTags = fruits.map(fruit => `<li>${fruit}</li>`);
console.log(htmlTags);
// 출력: ["<li>apple</li>", "<li>banana</li>", "<li>grape</li>"]


// 4. 숫자 배열에서 문자열 배열로 변환
const numbers3 = [1, 2, 3, 4, 5];
const stringNumbers = numbers3.map(num => num.toString());
console.log(stringNumbers);  // 출력: ["1", "2", "3", "4", "5"]


// 5. 문자열 배열에서 각 문자의 길이 추출
const words = ["hello", "world", "javascript"];
const lengths = words.map(word => word.length);
console.log(lengths);  // 출력: [5, 5, 10]


// 6. 객체 배열에서 조건에 따라 새로운 속성 추가
const products = [
    { name: "Laptop", price: 1000 },
    { name: "Phone", price: 500 },
    { name: "Tablet", price: 700 }
];

const withDiscount = products.map(product => ({
    ...product,
    discountedPrice: product.price > 600 ? product.price * 0.9 : product.price
}));
console.log(withDiscount);
// 출력:
// [
//     { name: "Laptop", price: 1000, discountedPrice: 900 },
//     { name: "Phone", price: 500, discountedPrice: 500 },
//     { name: "Tablet", price: 700, discountedPrice: 630 }
// ]


// 7. 데이터 가공
const apiData = [
    { id: 1, firstName: "John", lastName: "Doe" },
    { id: 2, firstName: "Jane", lastName: "Smith" }
];

const fullNames = apiData.map(user => `${user.firstName} ${user.lastName}`);
console.log(fullNames);  // 출력: ["John Doe", "Jane Smith"]
