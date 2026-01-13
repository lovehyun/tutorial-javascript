
import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

export function openDb(dbPath) {
  sqlite3.verbose();
  const db = new sqlite3.Database(dbPath);
  // Ensure FK
  db.exec('PRAGMA foreign_keys = ON;');
  return db;
}

export function run(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        console.error("SQL Error:", sql, params, err);
        return reject(err);
      }
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

export function get(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

export function all(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

export function readSqlFile(relPath) {
  const abs = path.resolve(relPath);
  return fs.readFileSync(abs, 'utf-8');
}
