// while 문을 사용한 함수
function sum_to_n(n) {
    console.time("sum_to_n 시간");
    let sum = 0;
    let num = 1;
    while (num <= n) {
        sum += num;
        num++;
    }
    console.log(`1부터 ${n}까지의 합:`, sum);
    console.timeEnd("sum_to_n 시간");
}

// for 문을 사용한 함수
function sum2_to_n(n) {
    console.time("sum2_to_n 시간");
    let sum = 0;
    for (let num = 1; num <= n; num++) {
        sum += num;
    }
    console.log(`1부터 ${n}까지의 합:`, sum);
    console.timeEnd("sum2_to_n 시간");
}

// 가우스 공식을 사용한 함수
function sum3_to_n(n) {
    console.time("sum3_to_n 시간");
    let sum = (n * (n + 1)) / 2;
    console.log(`1부터 ${n}까지의 합:`, sum);
    console.timeEnd("sum3_to_n 시간");
}

// 각 함수 호출
let n = 1000; // 여기서 원하는 값을 입력할 수 있습니다.
sum_to_n(n);
sum2_to_n(n);
sum3_to_n(n);
