// 정적 메서드는 클래스 자체에 연결되어 객체 인스턴스 없이 직접 호출됩니다.
class MathOperations {
    static PI = 3.14159;

    static add(x, y) {
        return x + y;
    }

    static subtract(x, y) {
        return x - y;
    }
}

console.log(MathOperations.PI);
console.log(MathOperations.add(5, 3)); // 출력: 8
console.log(MathOperations.subtract(10, 4)); // 출력: 6
