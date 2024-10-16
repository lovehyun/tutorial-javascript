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
