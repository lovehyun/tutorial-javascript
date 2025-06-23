// 3. 연산자

// 산술 연산자
let a = 10;
let b = 3;

console.log(a + b);
console.log(a - b);
console.log(a * b);
console.log(a / b);
console.log(a % b);

// 비교 연산자
console.log(a > b);
console.log(a === b);
console.log(a !== b);

// 논리 연산자
let result = (a > b) && (b > 0);
console.log(result);


// 4. 조건문
let score = 85;

if (score >= 90) {
    console.log("A");
} else if (score >= 80) {
    console.log("B");
} else {
    console.log("C");
}

// 삼항 연산자
let grade = score >= 90 ? "A" : "B or lower";
console.log(grade);
