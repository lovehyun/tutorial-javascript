const GenericCalculator = require('./GenericCalculator');

class EngineeringCalculator extends GenericCalculator {
    // 추가적인 공학용 계산 메서드 구현
    // 예: 지수, 로그, 삼각함수 등
    // 지수 함수 (exponential function)
    exponential(num, power) {
        return Math.pow(num, power);
    }

    // 로그 함수 (logarithmic function)
    logarithm(num, base) {
        return Math.log(num) / Math.log(base);
    }

    getOperators() {
        const ops = super.getOperators();
        const new_ops = ['exp', 'log'];
        return [...ops, ...new_ops];
    }
}

module.exports = EngineeringCalculator;
