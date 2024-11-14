// 1. 클래스 기본
class Animal {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    makeSound() {
        console.log(`${this.name} makes a sound`);
    }
}

const animal = new Animal("Lion", 5);
console.log(`Animal: ${animal.name}, Age: ${animal.age}`);
animal.makeSound();

// 2. 접근 제한자
class Person {
    public name: string;
    private age: number;
    protected address: string;

    constructor(name: string, age: number, address: string) {
        this.name = name;
        this.age = age;
        this.address = address;
    }

    getAge() {
        return this.age;
    }
}

const person = new Person("John", 30, "123 Street");
console.log(`Name: ${person.name}, Age: ${person.getAge()}`);

// 3. 읽기 전용 속성
class Car {
    readonly brand: string;
    readonly model: string;
    readonly year: number;

    constructor(brand: string, model: string, year: number) {
        this.brand = brand;
        this.model = model;
        this.year = year;
    }
}

const car = new Car("Toyota", "Camry", 2020);
console.log(`Car: ${car.brand}, Model: ${car.model}, Year: ${car.year}`);

// 4. 상속 및 메서드 오버라이딩
class Dog extends Animal {
    constructor(name: string, public breed: string) {
        super(name);
    }

    makeSound() {
        console.log(`${this.name} barks`);
    }
}

const dog = new Dog("Buddy", "Golden Retriever");
console.log(`Dog: ${dog.name}, Breed: ${dog.breed}`);
dog.makeSound();

// 5. 추상 클래스와 메서드
abstract class Shape {
    abstract getArea(): number;

    printArea() {
        console.log(`Area: ${this.getArea()}`);
    }
}

class Circle extends Shape {
    constructor(public radius: number) {
        super();
    }

    getArea(): number {
        return Math.PI * this.radius * this.radius;
    }
}

const circle = new Circle(10);
circle.printArea();
