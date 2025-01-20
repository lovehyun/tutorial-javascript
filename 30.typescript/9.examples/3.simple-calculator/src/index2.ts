type Operation2 = 'add' | 'subtract' | 'multiply' | 'divide';

/**
 * Performs a mathematical operation on two numbers.
 * @param a - The first operand
 * @param b - The second operand
 * @param operation - The operation to perform ('add', 'subtract', 'multiply', 'divide')
 * @returns The result of the operation or an error message if the operation is invalid
 */
function calculate(a: number, b: number, operation: Operation2): number | string {
    switch (operation) {
        case 'add':
            return a + b;
        case 'subtract':
            return a - b;
        case 'multiply':
            return a * b;
        case 'divide':
            if (b === 0) {
                throw new Error('Division by zero is not allowed');
            }
            return a / b;
        default:
            const _exhaustiveCheck: never = operation;
            throw new Error(`Unhandled operation: ${_exhaustiveCheck}`);
    }
}

// Safe wrapper to handle errors gracefully
function safeCalculate(a: number, b: number, operation: Operation2): string {
    try {
        const result = calculate(a, b, operation);
        return `The result of ${operation}ing ${a} and ${b} is: ${result}`;
    } catch (error) {
        if (error instanceof Error) {
            return `Error: ${error.message}`;
        }
        return 'An unexpected error occurred';
    }
}

// Example usage
console.log(safeCalculate(10, 5, 'add'));       // The result of adding 10 and 5 is: 15
console.log(safeCalculate(10, 5, 'divide'));    // The result of dividing 10 and 5 is: 2
console.log(safeCalculate(10, 0, 'divide'));    // Error: Division by zero is not allowed
// console.log(safeCalculate(10, 5, 'modulus'));   // Error: Unhandled operation: modulus
