// 5. 반복문

// for문
for (let i = 1; i <= 5; i++) {
    console.log("For 반복:", i);
}

// while문
let count = 1;
while (count <= 5) {
    console.log("While 반복:", count);
    count++;
}

// do...while문
let num = 1;
do {
    console.log("Do While 반복:", num);
    num++;
} while (num <= 3);

// 5-4. 응용
// 구구단 2단
for (let i = 1; i <= 9; i++) {
    console.log(`2 x ${i} = ${2 * i}`);
}

// 구구단 7단
let dan = 7;
for (let i = 1; i <= 9; i++) {
    console.log(`${dan} x ${i} = ${dan * i}`);
}

let dan = 7;
for (let i = 1; i <= 9; i++) {
    document.write(`${dan} x ${i} = ${dan * i}<br>`);
}

// 구구단 모든 단
for (let dan = 2; dan <= 9; dan++) {
    console.log(`--- ${dan}단 ---`);
    for (let i = 1; i <= 9; i++) {
        console.log(`${dan} x ${i} = ${dan * i}`);
    }
}

// do-while 2단
let dan = 2;
let i = 1;

do {
    console.log(`${dan} x ${i} = ${dan * i}`);
    i++;
} while (i <= 9);


// do-while 모든 단
let dan = 2;
do {
    console.log(`--- ${dan}단 ---`);
    
    let i = 1;
    do {
        console.log(`${dan} x ${i} = ${dan * i}`);
        i++;
    } while (i <= 9);

    dan++;
} while (dan <= 9);
