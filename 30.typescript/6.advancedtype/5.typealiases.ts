// 유니언 타입을 별칭으로 정의
type StringOrNumber = string | number;

let id: StringOrNumber;
id = 123;
console.log(`ID as number: ${id}`);

id = "abc";
console.log(`ID as string: ${id}`);

// 객체 타입을 별칭으로 정의
type Point = {
    x: number;
    y: number;
};

function printPoint(point: Point) {
    console.log(`Point coordinates: (${point.x}, ${point.y})`);
}

printPoint({ x: 10, y: 20 });
