// # 1. IF-ELSE 구문
let score = 80;

if (score >= 90) {
    console.log('A');
} else if (score >= 80) {
    console.log('B');
} else {
    console.log('C');
}


// 2. FOR 반복문
for (let i = 1; i <= 5; i++) {
    console.log(i);
}


// 3. WHILE 반복문
let count = 1;
while (count <= 5) {
    console.log("while loop iteration:", count);
    // count = count + 1;
    // count += 1;
    count++;
}


// 4. 함수
// function
function greet(name) {
    console.log('Hello, ' + name + '!');
}
  
greet('John');
  
function addNumbers(a, b) {
    return a + b;
}

// return value
let sum = addNumbers(5, 3);
console.log(sum);


// 기본 함수
const add = function(a, b) {
    return a + b;
};

console.log(add(2, 3));

// 화살표 함수로 변환
const addArrow = (a, b) => a + b;


// 5. 객체(object)
let person = {
    name: 'John',
    age: 25,
    greet: function() {
        console.log('Hello, ' + this.name + '!');
    }
};
  
console.log(person.name);
console.log(person.age);
person.greet();


// 6. 배열(array)
let fruits = ["Apple", "Banana", "Cherry"];

console.log("First fruit:", fruits[0]);
console.log("All fruits:", fruits);


// 배열 메서드 (push, pop, length)
fruits.push("Orange"); // 배열에 추가
console.log("Fruits after push:", fruits);

fruits.pop(); // 마지막 요소 제거
console.log("Fruits after pop:", fruits);


// 배열 반복
let numbers = [1, 2, 3, 4, 5];
numbers.forEach(function(number) {
    console.log(number);
});

numbers.forEach((number) => {
    console.log(number);
});
