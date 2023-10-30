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
