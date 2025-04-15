function sum_to_100() {
    let sum = 0;
    let num = 1;
    while (num <= 100) {
        sum += num;
        num++;
    }
    console.log("1부터 100까지의 합:", sum);
}

function sum2_to_100() {
    let sum = 0;
    for (let num = 1; num <= 100; num++) {
        sum += num;
    }
    console.log("1부터 100까지의 합:", sum);
}

// 가우스 공식 : sum = n(n+1)/2
function sum3_to_100() {
    let n = 100;
    let sum = (n * (n + 1)) / 2;
    console.log("1부터 100까지의 합:", sum);
}

// 부동소수점 오류, IEEE-754 표기법에서 0.1을 이진수로 바꾸면 0.0001100110011... (무한 반복)
// IEEE 754 (1985) 표준은 실수(소수)를 2진수로 표현하기 위한 방식
// 구성 요소	비트 수	설명
// 부호(S)	1bit	양수(0), 음수(1)
// 지수(E)	11bit	실제 지수 + 1023 (bias)
// 가수(F)	52bit	1.xxxx 형태의 소수 부분
let result = 0;
for (let i = 0; i < 10; i++) {
    result += 0.01;
}
console.log("Result:", result);
console.log("Equal to 0.1?", result === 0.1);


// 캐슁으로 인한 아래 시간 출력 오류 임시해결
sum_to_100();
sum2_to_100();

console.time("sum_to_100 시간");
sum_to_100();
console.timeEnd("sum_to_100 시간");

console.time("sum2_to_100 시간");
sum2_to_100();
console.timeEnd("sum2_to_100 시간");

console.time("sum3_to_100 시간");
sum3_to_100();
console.timeEnd("sum3_to_100 시간");
