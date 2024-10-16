// 하위 클래스에서 상위 클래스의 메서드를 재정의(오버라이딩)하여 새로운 구현을 제공할 수 있습니다.
class Shape {
    getArea() {
        return 0;
    }
}

class Square extends Shape {
    constructor(sideLength) {
        super();
        this.sideLength = sideLength;
    }

    getArea() {
        return this.sideLength ** 2;
    }
}

const mySquare = new Square(5);
console.log(mySquare.getArea()); // 출력: 25
