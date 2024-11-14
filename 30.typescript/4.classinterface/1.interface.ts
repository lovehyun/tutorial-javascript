// Person 인터페이스 정의
interface Person {
    name: string;
    age: number;
    isEmployed: boolean;
}

// Person 타입의 객체
const person: Person = {
    name: "Alice",
    age: 30,
    isEmployed: true,
};

console.log(`Name: ${person.name}, Age: ${person.age}, Employed: ${person.isEmployed}`);
