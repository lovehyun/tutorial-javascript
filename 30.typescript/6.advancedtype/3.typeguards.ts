function printValue(value: number | string) {
    if (typeof value === "string") {
        console.log(`String value: ${value.toUpperCase()}`); // 문자열일 때
    } else {
        console.log(`Number value: ${value.toFixed(2)}`);   // 숫자일 때
    }
}

printValue("hello"); // String value: HELLO
printValue(42);      // Number value: 42.00

// 클래스 타입 가드 예제
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
makeSound(dog); // Woof!
makeSound(cat); // Meow!
