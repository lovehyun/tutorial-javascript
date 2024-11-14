// 제네릭 인터페이스 정의
interface KeyValuePair<K, V> {
    key: K;
    value: V;
}

// KeyValuePair를 사용한 객체
const pair1: KeyValuePair<string, number> = { key: "age", value: 30 };
console.log(`Key: ${pair1.key}, Value: ${pair1.value}`); // Key: age, Value: 30

const pair2: KeyValuePair<number, string> = { key: 1, value: "one" };
console.log(`Key: ${pair2.key}, Value: ${pair2.value}`); // Key: 1, Value: one
