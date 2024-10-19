const scores = [85, 90, 'invalid', 78, 88];  // 여전히 'invalid' 값이 문제를 일으킬 수 있음
let sum = 0;

try {
    for (let i = 0; i < scores.length; i++) {
        if (typeof scores[i] !== 'number') {
            throw new Error(`잘못된 데이터 타입: ${scores[i]} (index: ${i})`);
        }
        sum += scores[i];
    }

    const average = sum / scores.length;

    if (average >= 80) {
        console.log('합격입니다!');
    } else {
        console.log('불합격입니다.');
    }
} catch (error) {
    console.log('점수 계산 중 오류가 발생했습니다:', error.message);
}
