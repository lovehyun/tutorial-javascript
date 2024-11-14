// 열거형 타입 정의
enum Direction {
    Up,    // 0
    Down,  // 1
    Left,  // 2
    Right  // 3
}

// 열거형 값 사용
let move: Direction = Direction.Up;
console.log(`Move Direction: ${Direction[move]}`); // Direction[move]는 이름으로 출력
