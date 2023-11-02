// generators/NameGenerator.js
const Generator = require('./Generator');

class NameGenerator extends Generator {
    constructor() {
        super();
        this.lastNames = ['김', '이', '박', '최', '정'];
        this.firstNames = ['민준', '서연', '예준', '지우', '하윤'];
    }

    generate() {
        const lastName = this.lastNames[Math.floor(Math.random() * this.lastNames.length)];
        const firstName = this.firstNames[Math.floor(Math.random() * this.firstNames.length)];
        return lastName + firstName;
    }
}

module.exports = NameGenerator;
