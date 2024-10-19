function sum_to_100() {
    let sum = 0;
    let num = 1;
    while (num <= 100) {
        sum += num;
        num++;
    }
    console.log("1부터 100까지의 합:", sum);
}

sum_to_100();
