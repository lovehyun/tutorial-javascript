CREATE TABLE IF NOT EXISTS clients (
  clientId TEXT PRIMARY KEY,
  ipAddress TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
  sessionId TEXT PRIMARY KEY,
  clientId TEXT,
  startTime TEXT,
  endTime TEXT,
  score INTEGER,
  FOREIGN KEY (clientId) REFERENCES clients(clientId)
);
