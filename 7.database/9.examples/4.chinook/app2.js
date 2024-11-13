require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const nunjucks = require('nunjucks');
const path = require('path');

const app = express();
const dbPath = process.env.DB_PATH;
const db = new sqlite3.Database(path.resolve(__dirname, dbPath));

// Nunjucks 설정
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.set('view engine', 'html');

app.use(express.urlencoded({ extended: true }));

// 메인 페이지: 검색 옵션과 폼
app.get('/', (req, res) => {
    res.render('index2', { results: [], searchScope: '' });
});

// 검색 실행
app.post('/search', (req, res) => {
    const { searchQuery, searchScope } = req.body;
    
    // 테이블 및 필드 매핑
    const searchOptions = {
        'artist': { table: 'artists', field: 'name' },
        'album': { table: 'albums', field: 'title' },
        'track': { table: 'tracks', field: 'name' },
        'composer': { table: 'tracks', field: 'composer' },
        'genre': { table: 'genres', field: 'name' },
        'customer': { table: 'customers', field: 'first_name' }  // 또는 last_name
    };
    
    const option = searchOptions[searchScope];
    if (!option) {
        res.status(400).send("유효하지 않은 검색 범위입니다.");
        return;
    }
    
    const sql = `SELECT * FROM ${option.table} WHERE ${option.field} LIKE ?`;
    db.all(sql, [`%${searchQuery}%`], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("데이터베이스 오류가 발생했습니다.");
            return;
        }
        res.render('index2', { results: rows, searchScope });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
