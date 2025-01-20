// src/index.ts
// ESModule 스타일, (NOT commonJS 스타일 (require))

import { add, subtract } from "./math";
import { toUpperCase, toLowerCase } from "./stringUtils";

console.log(`Add: ${add(10, 5)}`);             // Add: 15
console.log(`Subtract: ${subtract(10, 5)}`);    // Subtract: 5

console.log(`Uppercase: ${toUpperCase("hello")}`); // Uppercase: HELLO
console.log(`Lowercase: ${toLowerCase("WORLD")}`); // Lowercase: world
