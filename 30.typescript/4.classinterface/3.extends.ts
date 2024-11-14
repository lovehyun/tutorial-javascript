// BasicInfo 인터페이스 정의
interface BasicInfo {
    name: string;
    age: number;
}

// ContactInfo 인터페이스 정의
interface ContactInfo {
    email: string;
    phone: string;
}

// Employee 인터페이스는 BasicInfo와 ContactInfo를 확장
interface Employee extends BasicInfo, ContactInfo {
    employeeId: number;
}

// Employee 타입의 객체
const employee: Employee = {
    name: "Bob",
    age: 25,
    email: "bob@example.com",
    phone: "123-456-7890",
    employeeId: 101,
};

console.log(`Employee: ${employee.name}, ID: ${employee.employeeId}, Email: ${employee.email}`);
