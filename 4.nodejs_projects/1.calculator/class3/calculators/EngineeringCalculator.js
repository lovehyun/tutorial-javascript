// calculators/EngineeringCalculator.js
const GenericCalculator = require('./GenericCalculator');

class EngineeringCalculator extends GenericCalculator {
    exponential(num, power) {
        return Math.pow(num, power);
    }

    logarithm(num, base = 10) {
        return Math.log(num) / Math.log(base);
    }

    sine(angle) {
        return Math.sin(angle * (Math.PI / 180));
    }

    cosine(angle) {
        return Math.cos(angle * (Math.PI / 180));
    }

    tangent(angle) {
        return Math.tan(angle * (Math.PI / 180));
    }

    getSupportedOperators() {
        return super.getSupportedOperators().concat(['exp', 'log', 'sin', 'cos', 'tan']);
    }

    calculate(operator, num1, num2 = null) {
        if (!this.getSupportedOperators().includes(operator)) {
            return "Invalid operator";
        }

        switch (operator) {
            case 'exp':
                return this.exponential(num1, num2);
            case 'log':
                return this.logarithm(num1, num2);
            case 'sin':
                return this.sine(num1);
            case 'cos':
                return this.cosine(num1);
            case 'tan':
                return this.tangent(num1);
            default:
                return super.calculate(operator, num1, num2);
        }
    }
}

module.exports = EngineeringCalculator;
