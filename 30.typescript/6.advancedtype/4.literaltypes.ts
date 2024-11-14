// 리터럴 타입과 유니언 타입을 사용하여 허용되는 값 제한
type Direction = "left" | "right" | "up" | "down";

function move(direction: Direction) {
    console.log(`Moving: ${direction}`);
}

move("left");  // 허용됨
move("right"); // 허용됨
// move("forward"); // 오류 발생: "forward"는 허용되지 않음
