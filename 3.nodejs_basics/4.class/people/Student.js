const Person = require('./Person');

class Student extends Person {
    constructor(name, major) {
        super(name);
        this.major = major;
    }

    greet() {
        console.log(`안녕하세요, 제 이름은 ${this.name}이고, 전공은 ${this.major}입니다.`);
    }
}

module.exports = Student;
