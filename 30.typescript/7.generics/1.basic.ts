// 기본 제네릭 예제
// 제네릭은 호출 시점에 타입을 지정할 수 있게 해줍니다. 
// 이 예제에서 identity<T>는 입력값 value와 반환값의 타입이 동일함을 보장합니다.

function identity<T>(value: T): T {
    return value;
}

console.log(identity<string>("Hello")); // "Hello"
console.log(identity<number>(42));      // 42


// 제네릭	                                    Type Assertion
// 타입을 호출 시점에 지정함.	                  개발자가 특정 타입으로 값을 강제로 단언함.
// 컴파일러가 타입을 추론하거나 체크함.            컴파일러는 타입 체크를 생략하고 단언된 타입을 신뢰함.
// 타입 안전성을 유지하며 유연한 코드 작성 가능.	타입이 잘못되더라도 컴파일러가 경고하지 않음.
// 예: identity<number>(42)	                     예: (value as number).toFixed(2)

// 제네릭은 타입 안정성을 유지하며 재사용 가능한 코드를 작성하는 데 중점을 둡니다.
// Type Assertion은 컴파일러에게 "내가 이 타입을 확신하니 체크하지 말라"고 지시하는 것입니다. 
// 잘못된 타입 단언은 런타임 에러를 유발할 수 있습니다.
