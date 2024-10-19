const scores = [85, 90, 'invalid', 78, 88];  // 'invalid' 값이 문제를 일으킬 수 있음
let sum = 0;

for (let i = 0; i < scores.length; i++) {
    sum += scores[i];  // 문제가 발생할 수 있는 부분
}

// console.log('합산:', sum);
const average = sum / scores.length;

if (average >= 80) {
    console.log('합격입니다!');
} else {
    console.log('불합격입니다.');
}
