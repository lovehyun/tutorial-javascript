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

    // 동적 타입 언어라 (Car car) 같은 식으로 할 수 없음. TS에서 (car: Car) 라고 할수 있음
    getInCar(car) {
        console.log(car);
        console.log(`${this.name}이(가) ${car.brand} ${car.model}에 탑승했습니다.`);
    }

    // getInCar(car) {
    //     if (!(car instanceof Car)) {
    //         throw new Error('Car 인스턴스를 넘겨주세요!');
    //     }
    //     console.log(car);
    //     console.log(`${this.name}이(가) ${car.brand} ${car.model}에 탑승했습니다.`);
    // }
}

module.exports = Person;
