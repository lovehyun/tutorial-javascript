// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error

// 1. 기본 문법
// const result = someUndefinedVariable * 2;

try {
    // 예외가 발생할 수 있는 코드
    const result = someUndefinedVariable * 2;
    console.log(result); // 실행되지 않음 (위에서 예외가 발생하여 아래 catch 블록으로 이동)
} catch (error) {
    // 예외가 발생했을 때 처리할 코드
    console.error('예외가 발생했습니다:', error.message);
}


// 2. 오류 잡기 (간단한 문자열 생성)
function divide2(a, b) {
    try {
        if (b === 0) {
            throw '0으로 나눌 수 없습니다.';
        }
        return a / b;
    } catch (error) {
        return '오류 발생: ' + error;
    }
}

// 함수 호출
console.log(divide2(10, 2)); // 정상적인 경우: 10 나누기 2는 5를 반환합니다.
console.log(divide2(8, 0)); // 0으로 나누는 경우: 오류가 발생하고, 오류 메시지가 반환됩니다.
console.log('---');


// 3. 오류 생성 (Error 객체를 통해 오류 반환)
function divide3(a, b) {
    try {
        if (b === 0) {
            throw new Error('0으로 나눌 수 없습니다.');
        }
        return a / b;
    } catch (error) {
        console.error('오류 발생:', error.message);
        // console.error("스택 트레이스:", error.stack);
    }
}

// 함수 호출
console.log(divide3(10, 2)); // 정상적인 경우: 10 나누기 2는 5를 반환합니다.
console.log(divide3(8, 0)); // 0으로 나누는 경우: 오류가 발생하고, 오류 메시지가 출력됩니다.
console.log('---');


// 4. Finally 블럭
function divide4(a, b) {
    try {
        if (b === 0) {
            throw new Error('0으로 나눌 수 없습니다.');
        }
        return a / b;
    } catch (error) {
        console.error('오류 발생:', error.message);
    } finally {
        console.log('오류 발생 여부와 상관없이 finally 블록은 실행됩니다.');
    }
}

console.log(divide4(10, 2)); // 정상적인 경우: 10 나누기 2는 5를 반환합니다.
console.log(divide4(8, 0)); // 0으로 나누는 경우: 오류가 발생하고, 오류 메시지와 스택 트레이스가 출력됩니다.
console.log('---');


// 5. 다양한 오류 케이스 대응
function divide5(a, b) {
    try {
        if (typeof b !== 'number') {
            throw new TypeError('숫자를 입력하세요.');
        }
        if (typeof a === 'number') {
            input = a.toString();
            if (input.length > 9) {
                throw new RangeError('입력값은 9자리까지만 지원합니다.')
            }
        }
        if (b === 0) {
            throw new Error('0으로 나눌 수 없습니다.');
        }
        return a / b;
    } catch (error) {
        if (error instanceof TypeError) {
            console.error('타입 오류가 발생했습니다:', error.message);
        } else if (error instanceof RangeError) {
            console.error('범위 오류가 발생했습니다:', error.message);
        } else {
            console.error('기타 오류가 발생했습니다:', error.message);
        }
    }
}

console.log(divide5(10, 2)); // 정상적인 경우: 10 나누기 2는 5를 반환합니다.
console.log(divide5(10, '문자열')); // 문자열 입력값 체크.
console.log(divide5(1234567890, 5)); // 숫자 길이 입력값 체크.
console.log(divide5(8, 0)); // 0으로 나누는 경우: 오류가 발생하고, 오류 메시지와 스택 트레이스가 출력됩니다.
console.log('---');
