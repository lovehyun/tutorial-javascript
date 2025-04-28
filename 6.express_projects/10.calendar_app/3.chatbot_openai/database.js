// db.js
import sqlite3Package from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const sqlite3 = sqlite3Package.verbose();

// __dirname 대체 (ESM에서는 __dirname 사용 불가)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new sqlite3.Database(path.join(__dirname, 'calendar.db'), (err) => {
    if (err) {
        console.error('DB 연결 실패:', err.message);
    } else {
        console.log('✅ DB 연결 완료');
    }
});

export default db;
