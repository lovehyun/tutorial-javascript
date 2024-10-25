// child.js
const Person = require('./Person');

class Child extends Person {
    constructor(name, age, gender, schoolGrade) {
        super(name, age, gender);
        this.schoolGrade = schoolGrade;
    }

    playInCar() {
        console.log(`${this.name}이(가) 차 안에서 장난을 치고 있습니다.`);
    }
}

module.exports = Child;
