
import fs from 'fs';
import { authService } from './src/services/authService.js';
import { openDb } from './src/database/db.js';

const logFile = './debug_output.txt';
function log(msg) {
  try { fs.appendFileSync(logFile, msg + '\n'); } catch (e) {}
  console.log(msg);
}

log('Starting verification...');

const dbPath = './db/taskflow.sqlite'; 
const db = openDb(dbPath);

log('Testing createSampleUser...');
authService.createSampleUser(db)
    .then(res => log('Success: ' + JSON.stringify(res)))
    .catch(err => {
        log('Failed: ' + err.message);
        if (err.stack) log(err.stack);
    });
