// 1. 팩토리얼 계산
// 팩토리얼은 n! = n × (n-1)!로 정의되며, n이 1 또는 0이면 팩토리얼은 1입니다.
function factorial(n) {
    if (n <= 1) return 1; // 종료 조건
    return n * factorial(n - 1); // 재귀 호출
}

console.log(factorial(5)); // 5! = 5 * 4 * 3 * 2 * 1 = 120


// 2. 피보나치 수열
// 피보나치 수열은 f(n) = f(n-1) + f(n-2)로 정의되며, n이 0 또는 1이면 각각 0과 1을 반환합니다.
function fibonacci(n) {
    if (n <= 1) return n; // 종료 조건
    return fibonacci(n - 1) + fibonacci(n - 2); // 재귀 호출
}

console.log(fibonacci(6)); // 피보나치 수열의 6번째 값 = 8


// 3. 숫자의 합 구하기
// n부터 1까지의 합을 구하는 재귀 함수입니다.
function sum(n) {
    if (n <= 1) return n; // 종료 조건
    return n + sum(n - 1); // 재귀 호출
}

console.log(sum(5)); // 5 + 4 + 3 + 2 + 1 = 15
