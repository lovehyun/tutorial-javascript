// index.js
const { addNumbers, subtractNumbers } = require('./add2');

const sum = addNumbers(5, 3);
console.log('합:', sum);

const difference = subtractNumbers(8, 3);
console.log('차:', difference);
