-- sqlite3 calendar.db < init.sql
DROP TABLE IF EXISTS schedule;

CREATE TABLE schedule (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,  -- ISO 형식: YYYY-MM-DD
    title TEXT NOT NULL,
    description TEXT
);
