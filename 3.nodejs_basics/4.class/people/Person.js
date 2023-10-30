class Person {
    constructor(name) {
        this.name = name;
    }

    greet() {
        console.log(`안녕, 나는 ${this.name}이야.`);
    }
}

module.exports = Person;
