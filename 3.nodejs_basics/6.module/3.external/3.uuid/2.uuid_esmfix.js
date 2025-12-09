// npm install uuid
// package.json 에 "type":"module" 추가

import { v4 as uuidv4 } from 'uuid';

// Version 4 UUID 생성
const uuid = uuidv4();
console.log('생성된 UUID:', uuid);
