const Car = class {
    constructor(make, model) {
        this.make = make;
        this.model = model;
    }

    drive() {
        return `${this.make} ${this.model} is driving.`;
    }
};

// 클래스를 사용하여 객체 생성
const myCar = new Car('Hyundai', 'K5');
console.log(myCar.drive()); // 출력: "Hyundai K5 is driving."


/*
1. Class Declaration (클래스 선언) vs 2. Class Expression (클래스 표현식)
차이점 요약
호이스팅:
- Class Declaration: 클래스 선언은 호이스팅되지만, 정의된 이후에만 사용할 수 있습니다. 선언 이전에 접근하려 하면 ReferenceError가 발생합니다.
- Class Expression: 클래스 표현식은 호이스팅되지 않으며, 정의된 이후에만 사용할 수 있습니다.

클래스 이름:
- Class Declaration: 항상 명명된 클래스여야 하며, 이름은 필수입니다.
- Class Expression: 익명 클래스나 명명된 클래스로 정의할 수 있으며, 이름이 필수가 아닙니다.

코드 가독성:
- Class Declaration: 주로 클래스 정의를 코드의 최상단에 선언하는 방식으로 사용되어 가독성이 좋습니다.
- Class Expression: 함수 표현식처럼, 조건문 내에서나 즉시 실행 함수와 함께 사용할 수 있습니다.
*/
