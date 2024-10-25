const Person = require('./Person');

class Employee extends Person {
    constructor(name, jobTitle) {
        super(name);
        this.jobTitle = jobTitle;
    }

    greet() {
        console.log(`안녕, 나는 ${this.name}이고, 직위는 ${this.jobTitle}이야.`);
    }
}

module.exports = Employee;
