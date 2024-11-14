class Animal {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    // 메서드 정의
    makeSound() {
        console.log(`${this.name} makes a sound`);
    }
}

const animal = new Animal("Lion", 5);
console.log(`Animal: ${animal.name}, Age: ${animal.age}`);
animal.makeSound();
