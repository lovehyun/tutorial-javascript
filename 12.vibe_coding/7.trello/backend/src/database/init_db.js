
import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { openDb, readSqlFile, run } from './db.js';

const dbPath = process.env.DB_PATH || './db/taskflow.sqlite';
const initSqlPath = path.resolve('./init.sql');

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = openDb(dbPath);

try {
  const sql = readSqlFile(initSqlPath);
  await new Promise((resolve, reject) => {
    db.exec(sql, (err) => (err ? reject(err) : resolve()));
  });
  console.log('✅ DB initialized:', dbPath);
} catch (e) {
  console.error('❌ DB init failed:', e.message);
  process.exitCode = 1;
} finally {
  db.close();
}
