// for 루프
for (let i = 0; i < 5; i++) {
    console.log(`for 루프: 현재 값은 ${i}입니다.`);
}

// 2. while 루프
let j = 0;
while (j < 5) {
    console.log(`while 루프: 현재 값은 ${j}입니다.`);
    j++;
}

// 3. do-while 루프
let k = 0;
do {
    console.log(`do-while 루프: 현재 값은 ${k}입니다.`);
    k++;
} while (k < 5);


// 4. break
for (let i = 0; i < 5; i++) {
    if (i === 3) {
      break; // i가 3이 되면 반복문을 종료
    }
    console.log(i);
}
// 출력: 0, 1, 2

  
// 5. continue
for (let i = 0; i < 5; i++) {
    if (i === 2) {
      continue; // i가 2이면 현재 반복을 건너뛰고 다음 반복으로 이동
    }
    console.log(i);
}
// 출력: 0, 1, 3, 4
