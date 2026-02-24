class Person {
    name: string;
    age: number;
    isEmployed: boolean;

    constructor(name: string, age: number, isEmployed: boolean) {
        this.name = name;
        this.age = age;
        this.isEmployed = isEmployed;
    }

    getInfo(): string {
        return `Name: ${this.name}, Age: ${this.age}, Employed: ${this.isEmployed}`;
    }
}

// 객체 생성
const person: Person = new Person("Alice", 30, true);
console.log(person.getInfo());
