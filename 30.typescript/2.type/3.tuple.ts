// 튜플 타입: 문자열과 숫자를 각각 담음
let person: [string, number] = ["Alice", 30];
console.log(`Person Tuple: Name - ${person[0]}, Age - ${person[1]}`);

// 구조 분해 할당으로 튜플의 각 요소를 변수에 할당
const [username, age] = person;
console.log(`Person Tuple: Name - ${username}, Age - ${age}`);
