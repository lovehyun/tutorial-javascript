const scores = [85, 90, 'invalid', 78, 88];  // 여전히 'invalid' 값이 문제를 일으킬 수 있음
let sum = 0;

function trycatch_example1() {
    for (let i = 0; i < scores.length; i++) {
        try {
            if (typeof scores[i] !== 'number') {
                throw new TypeError(`유효하지 않은 값 발견: ${scores[i]}`);
            }
            sum += scores[i];  // 유효한 숫자인 경우에만 합산
        } catch (error) {
            console.error(`에러 발생: ${error.message}`);
            // 에러 발생 시 'invalid' 값을 0으로 처리하거나 다른 방법으로 처리할 수 있음
            // sum += 0; // 예를 들어 invalid 값을 0으로 처리할 수 있음
        }
    }

    const average = sum / scores.length;

    if (average >= 80) {
        console.log('합격입니다!');
    } else {
        console.log('불합격입니다.');
    }
}

function trycatch_example2() {
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
}

trycatch_example1();
