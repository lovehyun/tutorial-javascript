class Car {
    constructor(name) {
        this.name = name;
    }

    // toString() {
    //     return `내차는: ${this.name}`;
    // }
}

const myCar = new Car('Tesla');
console.log(myCar); // Car { name: 'Tesla' }
console.log('My car is: ', myCar); // Car { name: 'Tesla' }
console.log('My car is: ' + myCar); // My car is: [object Object]
console.log(`My car is: ${myCar}`); // My car is: [object Object]

// 객체의 기본은 그대로 구조와 프로퍼티가 출력됨
// "문자열 연산(operation)"을 하면 Object.prototype.toString() 함수가 호출됨. 암묵적 타입 변환(implicit type coercion)
// 즉 [object Object] 는 이 형태로 toString() 호출된 상태임.
