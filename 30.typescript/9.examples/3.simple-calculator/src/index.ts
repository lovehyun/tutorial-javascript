type Operation = 'add' | 'subtract' | 'multiply' | 'divide';

function calculate(a: number, b: number, operation: Operation): number | string {
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

console.log(calculate(10, 5, 'add')); // Example usage
