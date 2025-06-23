// 7. 배열
let fruits = ["Apple", "Banana", "Cherry"];

// 배열 접근
console.log(fruits[0]);
console.log(fruits[1]);

// 배열 메서드
fruits.push("Orange");
console.log(fruits);

fruits.pop();
console.log(fruits);

// 배열 반복
fruits.forEach(function(fruit) {
    console.log(fruit);
});

// map 사용
let lengths = fruits.map(fruit => fruit.length);
console.log(lengths);

// filter 사용
let longFruits = fruits.filter(fruit => fruit.length > 5);
console.log(longFruits);
