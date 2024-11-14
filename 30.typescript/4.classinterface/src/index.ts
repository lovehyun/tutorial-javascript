// 1. 인터페이스 정의
interface Person {
    name: string;
    age: number;
    isEmployed: boolean;
}

const person: Person = {
    name: "Alice",
    age: 30,
    isEmployed: true,
};

console.log(`Name: ${person.name}, Age: ${person.age}, Employed: ${person.isEmployed}`);

// 2. 선택적 프로퍼티와 읽기 전용 속성
interface Product {
    readonly id: number;
    name: string;
    price?: number;
}

const product: Product = {
    id: 1,
    name: "Laptop",
};

console.log(`Product ID: ${product.id}, Name: ${product.name}, Price: ${product.price}`);

// 3. 인터페이스 확장
interface BasicInfo {
    name: string;
    age: number;
}

interface ContactInfo {
    email: string;
    phone: string;
}

interface Employee extends BasicInfo, ContactInfo {
    employeeId: number;
}

const employee: Employee = {
    name: "Bob",
    age: 25,
    email: "bob@example.com",
    phone: "123-456-7890",
    employeeId: 101,
};

console.log(`Employee: ${employee.name}, ID: ${employee.employeeId}, Email: ${employee.email}`);

// 4. 함수 타입 인터페이스
interface Calculate {
    (a: number, b: number): number;
}

const add: Calculate = (a, b) => a + b;
console.log(`Add: ${add(5, 10)}`); // Add: 15

const multiply: Calculate = (a, b) => a * b;
console.log(`Multiply: ${multiply(5, 10)}`); // Multiply: 50
