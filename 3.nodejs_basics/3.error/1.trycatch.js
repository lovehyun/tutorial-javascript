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


// 2. 참조 오류 (ReferenceError) 처리
try {
    console.log(undefinedVariable); // 존재하지 않는 변수를 참조하므로 ReferenceError 발생
} catch (error) {
    if (error instanceof ReferenceError) {
        console.log("참조 오류가 발생했습니다:", error.message);
    } else {
        console.log("다른 오류:", error.message);
    }
}

// 3. 문법적 오류 (SyntaxError) 처리
try {
    eval("alert('Hello)"); // 따옴표가 닫히지 않아서 SyntaxError 발생
} catch (error) {
    if (error instanceof SyntaxError) {
        console.log("문법 오류가 발생했습니다:", error.message);
    } else {
        console.log("다른 오류:", error.message);
    }
}


// 4. 타입 오류 (TypeError) 처리
try {
    let obj = null;
    obj.method(); // TypeError: null에서 메서드를 호출할 수 없음
} catch (error) {
    if (error instanceof TypeError) {
        console.log("타입 오류가 발생했습니다:", error.message);
    } else {
        console.log("다른 오류:", error.message);
    }
}


// 5. 범위 오류 (RangeError) 처리
try {
    let arr = new Array(-1); // Array의 길이는 양수여야 하므로 RangeError 발생
} catch (error) {
    if (error instanceof RangeError) {
        console.log("범위 오류가 발생했습니다:", error.message);
    } else {
        console.log("다른 오류:", error.message);
    }
}


// 6. 다양한 오류 케이스 대응
try {
    // 존재하지 않는 함수 호출 (ReferenceError 발생)
    nonExistentFunction();
} catch (error) {
    if (error instanceof TypeError) {
        console.log("타입 오류:", error.message);
    } else if (error instanceof ReferenceError) {
        console.log("참조 오류:", error.message);
    } else if (error instanceof RangeError) {
        console.log("범위 오류:", error.message);
    } else {
        console.log("기타 오류:", error.message);
    }
}


// 7. 함수 구현 예제 (다양한 오류 처리 포함)
function divide(a, b) {
    return a / b;
}

function divide2(a, b) {
    // a와 b가 숫자인지 확인
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new Error("인자는 숫자여야 합니다.");
    }

    return a / b;
}

function divide3(a, b) {
    // a와 b가 숫자인지 확인
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new Error("인자는 숫자여야 합니다.");
    }

    // 0으로 나누는 것을 방지
    if (b === 0) {
        throw new Error("0으로 나눌 수 없습니다.");
    }

    return a / b;
}


function divide4(a, b) {
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

console.log(divide4(10, 2)); // 정상적인 경우: 10 나누기 2는 5를 반환합니다.
console.log(divide4(10, '문자열')); // 문자열 입력값 체크.
console.log(divide4(1234567890, 5)); // 숫자 길이 입력값 체크.
console.log(divide4(8, 0)); // 0으로 나누는 경우: 오류가 발생하고, 오류 메시지와 스택 트레이스가 출력됩니다.
console.log('---');
