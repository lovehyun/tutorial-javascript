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

// app.use(express.urlencoded({ extended: true }));

// 메인 페이지: 검색 옵션과 폼
app.get('/', (req, res) => {
    res.render('index3', { results: [], searchScope: '' });
});

// 검색 실행
app.get('/search', (req, res) => {
    const { searchQuery, searchScope, page = 1 } = req.query;
    const currentPage = parseInt(page) || 1; // 페이지 값이 없거나 NaN일 경우 기본값 1로 설정
    const itemsPerPage = 10; // 페이지당 결과 수
    const offset = (currentPage - 1) * itemsPerPage;

    console.log(`searchQuery: ${searchQuery}, searchScope: ${searchScope}, page: ${page}`);

    // 테이블 및 필드 매핑
    const searchOptions = {
        'artist': { table: 'artists', field: 'name' },
        'album': { table: 'albums', field: 'title' },
        'track': { table: 'tracks', field: 'name' },
        'composer': { table: 'tracks', field: 'composer' },
        'genre': { table: 'genres', field: 'name' },
        'customer': { table: 'customers', field: 'firstname' }  // 또는 lastname
    };
    
    const option = searchOptions[searchScope];
    if (!option) {
        res.status(400).send("유효하지 않은 검색 범위입니다.");
        return;
    }
    
    // 전체 결과 개수 계산
    const countSql = `SELECT COUNT(*) AS count FROM ${option.table} WHERE ${option.field} LIKE ?`;
    db.get(countSql, [`%${searchQuery}%`], (err, countRow) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("데이터베이스 오류가 발생했습니다.");
            return;
        }

        const totalResults = countRow.count;
        const totalPages = Math.ceil(totalResults / itemsPerPage); // 전체 페이지 수 계산

        // 검색 결과 조회
        const sql = `SELECT * FROM ${option.table} WHERE ${option.field} LIKE ? LIMIT ? OFFSET ?`;
        db.all(sql, [`%${searchQuery}%`, itemsPerPage, offset], (err, rows) => {
            if (err) {
                console.error(err.message);
                res.status(500).send("데이터베이스 오류가 발생했습니다.");
                return;
            }
            res.render('index3', {
                results: rows,
                searchScope,
                searchQuery,
                currentPage,
                totalPages
            });
        });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
