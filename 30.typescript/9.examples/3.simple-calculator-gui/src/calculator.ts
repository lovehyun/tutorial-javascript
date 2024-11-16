export type Operation = 'add' | 'subtract' | 'multiply' | 'divide';

export class Calculator {
    public calculate(a: number, b: number, operation: Operation): number | string {
        switch (operation) {
            case 'add':
                return a + b;
            case 'subtract':
                return a - b;
            case 'multiply':
                return a * b;
            case 'divide':
                return b !== 0 ? a / b : 'Error: Division by zero';
            default:
                return 'Invalid operation';
        }
    }
}
