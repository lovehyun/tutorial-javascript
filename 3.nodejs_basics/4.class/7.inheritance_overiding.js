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


class Triangle extends Shape {
    constructor(base, height) {
        super();                // Shape 생성자 호출
        this.base = base;       // 밑변
        this.height = height;   // 높이
    }

    // 메서드 오버라이딩: 삼각형의 넓이 = 밑변 * 높이 / 2
    getArea() {
        return (this.base * this.height) / 2;
    }
}

const triangle = new Triangle(10, 4);  // 밑변 10, 높이 4인 삼각형
