class Person {
    constructor(name, age, gender) {
        this.name = name;
        this.age = age;
        this.gender = gender;
    }

    greet() {
        console.log(`안녕, 나는 ${this.name}이고, ${this.age}살이야.`);
    }

    walk() {
        console.log(`${this.name}이(가) 걷고 있습니다.`);
    }

    eat() {
        console.log(`${this.name}이(가) 식사 중입니다.`);
    }

    // 기타 메서드: 일하기, 취미 활동, 특정한 행동 등을 추가할 수 있습니다.
}

// Person 객체 생성 및 활용
const person1 = new Person("철수", 25, "남성");
person1.greet(); // "안녕, 나는 철수이고, 25살이야." 출력
person1.walk(); // "철수이(가) 걷고 있습니다." 출력
person1.eat(); // "철수이(가) 식사 중입니다." 출력


class Employee extends Person {
    constructor(name, age, gender, jobTitle, salary) {
        super(name, age, gender);
        this.jobTitle = jobTitle;
        this.salary = salary;
    }

    greet() {
        console.log(`안녕, 나는 ${this.name}이고, 직위는 ${this.jobTitle}이야.`);
    }

    displayInfo() {
        console.log(`직원 ${this.name}의 직위는 ${this.jobTitle}이며, 급여는 ${this.salary}원 입니다.`);
    }

    work() {
        console.log(`${this.name}이(가) 업무 중입니다.`);
    }
}

// Employee 객체 생성 및 활용
const employee1 = new Employee("영희", 30, "여성", "매니저", 50000);
employee1.greet(); // "안녕, 나는 영희이고, 30살이야." 출력
employee1.displayInfo(); // "직원 영희의 직위는 매니저이며, 급여는 50000원 입니다." 출력
employee1.work(); // "영희이(가) 업무 중입니다." 출력


class Manager extends Employee {
    constructor(name, age, gender, jobTitle, salary, team) {
        super(name, age, gender, jobTitle, salary);
        this.team = team;
    }

    assignTasks() {
        console.log(`${this.name} 매니저가 팀에 업무를 배분하고 있습니다.`);
    }
    // 다른 매니저 관련 기능 추가 가능
}

class Student extends Person {
    constructor(name, age, gender, studentID, major) {
        super(name, age, gender);
        this.studentID = studentID;
        this.major = major;
    }

    greet() {
        console.log(`안녕하세요, 제 이름은 ${this.name}이고, 전공은 ${this.major}입니다.`);
    }

    study() {
        console.log(`${this.name} 학생이 ${this.major}를 공부하고 있습니다.`);
    }
    // 학생 관련 추가 기능 포함 가능
}

class Customer extends Person {
    constructor(name, age, gender, customerID, orderHistory) {
        super(name, age, gender);
        this.customerID = customerID;
        this.orderHistory = orderHistory;
    }

    placeOrder() {
        console.log(`${this.name} 고객이 주문을 완료했습니다.`);
    }
    // 고객 관련 추가 기능 포함 가능
}

// Manager 객체 생성 및 활용
const manager1 = new Manager("영민", 35, "남성", "팀장", 60000, "개발팀");
manager1.assignTasks(); // "영민 매니저가 팀에 업무를 배분하고 있습니다." 출력

// Student 객체 생성 및 활용
const student1 = new Student("지연", 20, "여성", "2023001", "컴퓨터 공학");
student1.study(); // "지연 학생이 컴퓨터 공학을 공부하고 있습니다." 출력

// Customer 객체 생성 및 활용
const customer1 = new Customer("태식", 30, "남성", "C1001", ["주문1", "주문2"]);
customer1.placeOrder(); // "태식 고객이 주문을 완료했습니다." 출력


console.log('-----');
// 함수에서 다형성 활용 - 하나의 인터페이스로 여러 클래스 처리
function introduce(people) {
    for (const person of people) {
        person.greet();
    }
    for (let i = 0; i < people.length; i++) {
        people[i].walk();
        
        if (people[i] instanceof Employee) {
            people[i].work();
        }
    }
}

const employee2 = new Employee("영희", jobTitle="매니저"); // 이렇게 일부만 할당 불가
const student2 = new Student("철수", major="컴퓨터 공학"); // 이렇게 일부만 할당 불가. 그냥 두번째 인자로 입력되고, 나머지는 모두 undefined.
const people = [manager1, student1, customer1, employee2, student2];

introduce(people);
