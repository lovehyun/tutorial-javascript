import { Calculator, Operation } from './calculator';

const calculator = new Calculator();

document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('#display') as HTMLInputElement;

    let currentInput = '';
    let previousInput = '';
    let operation: Operation | null = null;

    const updateDisplay = (value: string) => {
        display.value = value;
    };

    const handleNumberClick = (num: string) => {
        currentInput += num;
        updateDisplay(currentInput);
    };

    const handleOperationClick = (op: Operation) => {
        if (currentInput) {
            previousInput = currentInput;
            currentInput = '';
            operation = op;
        }
    };

    const handleEqualClick = () => {
        if (previousInput && currentInput && operation) {
            const result = calculator.calculate(parseFloat(previousInput), parseFloat(currentInput), operation);
            updateDisplay(result.toString());
            previousInput = '';
            currentInput = '';
            operation = null;
        }
    };

    const handleClearClick = () => {
        currentInput = '';
        previousInput = '';
        operation = null;
        updateDisplay('');
    };

    document.querySelectorAll('.number').forEach((button) => {
        button.addEventListener('click', () => handleNumberClick(button.textContent!));
    });

    document.querySelectorAll('.operation').forEach((button) => {
        button.addEventListener('click', () => handleOperationClick(button.getAttribute('data-op') as Operation));
    });

    document.querySelector('#equals')?.addEventListener('click', handleEqualClick);
    document.querySelector('#clear')?.addEventListener('click', handleClearClick);
});
