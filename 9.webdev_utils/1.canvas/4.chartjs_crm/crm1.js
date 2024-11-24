const express = require('express');
const nunjucks = require('nunjucks');
const sqlite3 = require('sqlite3');

const app = express();
const port = 3000;

// Nunjucks 설정
nunjucks.configure('views', {
    autoescape: true,
    express: app,
});

app.set('view engine', 'html');

app.get('/', (req, res) => {
    const db = new sqlite3.Database('crm.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Connected to the CRM database.');
        }
    });

    // SQL 쿼리 실행
    db.all(`
        SELECT 
            strftime('%Y-%m', "orders"."OrderAt") AS YearMonth,
            SUM(items.UnitPrice) AS MonthlyRevenue
        FROM 
            "orders"
        JOIN 
            "orderitems" ON "orders"."Id" = "orderitems"."OrderId"
        JOIN 
            "items" ON "orderitems"."ItemId" = "items"."Id"
        WHERE 
            "orders"."OrderAt" >= date('now', '-1 year')
        GROUP BY 
            strftime('%Y-%m', "orders"."OrderAt")
        ORDER BY 
            strftime('%Y-%m', "orders"."OrderAt")
        `,
        [],
        (err, rows) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Internal Server Error');
            } else {
                // 템플릿에 결과 전달하여 렌더링
                res.render('monthly_revenue1', { rows: rows });
            }
        }
    );

    // 데이터베이스 연결 닫기
    db.close((err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Closed the CRM database connection.');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
