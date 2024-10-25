// parent.js
const Person = require('./Person');

class Parent extends Person {
    constructor(name, age, gender, job) {
        super(name, age, gender);
        this.job = job;
    }

    driveCar(car) {
        console.log(`${this.name}이(가) ${car.brand} ${car.model}를 운전하고 있습니다.`);
    }
}

module.exports = Parent;
