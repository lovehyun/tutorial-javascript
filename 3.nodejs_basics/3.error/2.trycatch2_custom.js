// 사용자 정의 오류
// 직접 오류를 생성하고 처리할 수 있음. throw 문을 사용하여 에러를 던질 수 있음.

// 1. 오류 생성 (간단한 문자열 생성) - 비추천
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


// 2. 오류 생성 (Error 객체를 통해 오류 반환) - 추천 (stack 등 추가 정보가 담김)
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


// 3. Finally 블럭
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


// 4. 다양한 에러 체크 사례
// 4-1. 숫자 확인
function multiply(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new Error('숫자만 입력해야 합니다.');
    }
    return a * b;
}

try {
    console.log(multiply(10, 'abc'));
} catch (error) {
    console.log('오류 발생: ' + error.message); // '오류 발생: 숫자만 입력해야 합니다.'
}

// 4-2. 범위 확인
function checkAge(age) {
    if (age < 0 || age > 120) {
        throw new Error('유효하지 않은 나이입니다.');
    }
    return `나이는 ${age}입니다.`;
}

try {
    console.log(checkAge(150));
} catch (error) {
    console.log('오류 발생: ' + error.message); // '오류 발생: 유효하지 않은 나이입니다.'
}
