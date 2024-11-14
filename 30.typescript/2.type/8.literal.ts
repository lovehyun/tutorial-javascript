// 리터럴 타입 사용
let direction: "left" | "right" | "up" | "down";

direction = "left";    // 허용되는 값
console.log(`Direction: ${direction}`);

// direction = "forward"; // 오류 발생: 허용되지 않는 값
