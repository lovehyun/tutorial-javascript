// 두 인터페이스를 정의
interface Person {
    name: string;
    age: number;
}

interface Employee {
    employeeId: number;
    department: string;
}

// Person과 Employee 속성을 모두 포함하는 교차 타입
type Staff = Person & Employee;

const staff: Staff = {
    name: "Alice",
    age: 30,
    employeeId: 101,
    department: "Engineering",
};

console.log(`Staff: ${staff.name}, Age: ${staff.age}, Department: ${staff.department}`);
