// Product 인터페이스 정의
interface Product {
    readonly id: number;  // 읽기 전용 속성
    name: string;
    price?: number;       // 선택적 속성
}

// Product 타입의 객체
const product: Product = {
    id: 1,
    name: "Laptop",
    // price 속성은 선택 사항이므로 생략 가능
};

console.log(`Product ID: ${product.id}, Name: ${product.name}, Price: ${product.price}`);

// product.id = 2; // 오류 발생: 읽기 전용 속성은 수정할 수 없음
