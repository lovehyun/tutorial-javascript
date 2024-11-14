// 1. 유니언 타입
let value: number | string;
value = 42;
console.log(`Value as number: ${value}`);
value = "Hello";
console.log(`Value as string: ${value}`);

function printId(id: number | string) {
    console.log(`ID: ${id}`);
}

printId(123);
printId("abc123");

// 2. 교차 타입
interface Person {
    name: string;
    age: number;
}

interface Employee {
    employeeId: number;
    department: string;
}

type Staff = Person & Employee;

const staff: Staff = {
    name: "Alice",
    age: 30,
    employeeId: 101,
    department: "Engineering",
};

console.log(`Staff: ${staff.name}, Age: ${staff.age}, Department: ${staff.department}`);

// 3. 타입 가드
function printValue(value: number | string) {
    if (typeof value === "string") {
        console.log(`String value: ${value.toUpperCase()}`);
    } else {
        console.log(`Number value: ${value.toFixed(2)}`);
    }
}

printValue("hello");
printValue(42);

class Dog {
    bark() {
        console.log("Woof!");
    }
}

class Cat {
    meow() {
        console.log("Meow!");
    }
}

function makeSound(animal: Dog | Cat) {
    if (animal instanceof Dog) {
        animal.bark();
    } else {
        animal.meow();
    }
}

const dog = new Dog();
const cat = new Cat();
makeSound(dog);
makeSound(cat);

// 4. 리터럴 타입
type Direction = "left" | "right" | "up" | "down";

function move(direction: Direction) {
    console.log(`Moving: ${direction}`);
}

move("left");
move("right");

// 5. 타입 별칭
type StringOrNumber = string | number;

let id: StringOrNumber;
id = 123;
console.log(`ID as number: ${id}`);
id = "abc";
console.log(`ID as string: ${id}`);

type Point = {
    x: number;
    y: number;
};

function printPoint(point: Point) {
    console.log(`Point coordinates: (${point.x}, ${point.y})`);
}

printPoint({ x: 10, y: 20 });
