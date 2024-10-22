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
