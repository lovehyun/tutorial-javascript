// add.js 파일 - 더하는 함수를 포함하는 모듈

// module.exports: 이는 Node.js에서 CommonJS 모듈 시스템에서 사용됩니다. 이 방식은 모듈 시스템을 구현한 Node.js에서 모듈을 내보내는 데 사용됩니다.

// 두 숫자를 더하는 함수
function addNumbers(a, b) {
    return a + b;
}

// 모듈로 export
module.exports = addNumbers;
