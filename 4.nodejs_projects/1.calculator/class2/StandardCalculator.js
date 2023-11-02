const GenericCalculator = require('./GenericCalculator');

class StandardCalculator extends GenericCalculator {
    // 추가적인 일반 계산 메서드 구현
    // 예: 제곱근, 반올림, 기타 수학 함수 등
    getOperators() {
        const ops = super.getOperators();
        return ops.concat(['^']);
    }
}

module.exports = StandardCalculator;
