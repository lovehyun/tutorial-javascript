// person.js
class Person {
    constructor(name, age, gender) {
        this.name = name;
        this.age = age;
        this.gender = gender;
    }

    greet() {
        console.log(`안녕하세요, 저는 ${this.name}입니다.`);
    }

    getInCar(car) {
        console.log(car);
        console.log(`${this.name}이(가) ${car.brand} ${car.model}에 탑승했습니다.`);
    }
}

module.exports = Person;
