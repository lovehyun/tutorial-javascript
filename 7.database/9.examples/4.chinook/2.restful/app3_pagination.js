require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const dbPath = process.env.DB_PATH;
const db = new sqlite3.Database(path.resolve(__dirname, dbPath));

// "public" 폴더의 정적 파일 제공
app.use(express.static('public'));

// 메인 라우트에서 index3.html 불러오기
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index3.html'));
});

// 페이징 검색 API 엔드포인트
app.get('/api/search', (req, res) => {
    const { searchQuery, searchScope, page = 1 } = req.query;
    const currentPage = parseInt(page) || 1; // 페이지 값이 없거나 NaN일 경우 기본값 1로 설정
    const itemsPerPage = 10; // 페이지당 결과 수
    const offset = (currentPage - 1) * itemsPerPage;

    // 검색 범위에 따른 테이블 및 필드 매핑
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
        res.status(400).json({ error: "유효하지 않은 검색 범위입니다." });
        return;
    }

    // 페이징을 위해 전체 결과 수 계산
    const countSql = `SELECT COUNT(*) AS count FROM ${option.table} WHERE ${option.field} LIKE ?`;
    db.get(countSql, [`%${searchQuery}%`], (err, countRow) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: "데이터베이스 오류가 발생했습니다." });
            return;
        }

        const totalResults = countRow.count;
        const totalPages = Math.ceil(totalResults / itemsPerPage); // 전체 페이지 수 계산

        // 페이징 적용한 검색 결과 조회
        const sql = `SELECT * FROM ${option.table} WHERE ${option.field} LIKE ? LIMIT ? OFFSET ?`;
        db.all(sql, [`%${searchQuery}%`, itemsPerPage, offset], (err, rows) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: "데이터베이스 오류가 발생했습니다." });
                return;
            }
            // JSON 형식으로 결과 및 페이지 정보 반환
            res.json({
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
