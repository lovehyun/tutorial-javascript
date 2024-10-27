// calculators/ProgrammerCalculator.js
const GenericCalculator = require('./GenericCalculator');

class ProgrammerCalculator extends GenericCalculator {
    binary(num) {
        return `Binary: ${num.toString(2)}`;
    }

    hexadecimal(num) {
        return `Hexadecimal: ${num.toString(16)}`;
    }

    bitwiseAnd(num1, num2) {
        return num1 & num2;
    }

    bitwiseOr(num1, num2) {
        return num1 | num2;
    }

    getSupportedOperators() {
        return super.getSupportedOperators().concat(['bin', 'hex', 'and', 'or']);
    }

    calculate(operator, num1, num2 = null) {
        if (!this.getSupportedOperators().includes(operator)) {
            return "Invalid operator";
        }

        switch (operator) {
            case 'bin':
                return this.binary(num1);
            case 'hex':
                return this.hexadecimal(num1);
            case 'and':
                return this.bitwiseAnd(num1, num2);
            case 'or':
                return this.bitwiseOr(num1, num2);
            default:
                return super.calculate(operator, num1, num2);
        }
    }
}

module.exports = ProgrammerCalculator;
