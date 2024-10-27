const crypto = require('crypto');

// 해시 생성 (Hashing)
const dataToHash = 'Hello, World!';
const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
console.log('해시 결과:', hash);


// 암호화 (Encryption)
const algorithm = 'aes-192-cbc';
const password = 'MySuperSecretPassword';
const key = crypto.scryptSync(password, 'salt', 24);
const iv = Buffer.alloc(16, 0); // 초기화 벡터(Initialization Vector)

const cipher = crypto.createCipheriv(algorithm, key, iv);
let encrypted = cipher.update(dataToHash, 'utf8', 'hex');
encrypted += cipher.final('hex');
console.log('암호화된 결과:', encrypted);


// 복호화 (Decryption)
const decipher = crypto.createDecipheriv(algorithm, key, iv);
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log('복호화된 결과:', decrypted);
