// 클래스 내에 Getter와 Setter 메서드를 사용하여 객체의 속성을 조작할 수 있습니다.
class Circle {
    constructor(radius) {
        this._radius = radius;
    }

    get diameter() {
        return this._radius * 2;
    }

    set diameter(diameter) {
        this._radius = diameter / 2;
    }
}

const myCircle = new Circle(5);
console.log(myCircle.diameter); // 출력: 10

myCircle.diameter = 14;
console.log(myCircle._radius); // 출력: 7
