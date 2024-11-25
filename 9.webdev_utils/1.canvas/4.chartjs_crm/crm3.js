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

app.set('view engine', 'njk');

app.get('/', (req, res) => {
    const db = new sqlite3.Database('crm.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Connected to the CRM database.');
        }
    });

    // SQL 쿼리 실행
    db.all(`
        SELECT 
            strftime('%Y-%m', "orders"."OrderAt") AS YearMonth,
            SUM(items.UnitPrice) AS MonthlyRevenue,
            COUNT(orderitems.ItemId) AS ItemCount
        FROM 
            "orders"
        JOIN 
            "orderitems" ON "orders"."Id" = "orderitems"."OrderId"
        JOIN 
            "items" ON "orderitems"."ItemId" = "items"."Id"
        WHERE 
            "orders"."OrderAt" >= '2023-01-01' AND "orders"."OrderAt" <= '2023-12-31'
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
                // 데이터 포맷 변환
                const labels = rows.map((row) => row.YearMonth);
                const revenues = rows.map((row) => row.MonthlyRevenue);
                const itemcounts = rows.map((row) => row.ItemCount);

                // 템플릿에 데이터 전달하여 렌더링
                res.render('monthly_revenue3', { 
                    rows: rows, 
                    labels: JSON.stringify(labels), 
                    revenues: JSON.stringify(revenues),
                    itemcounts: JSON.stringify(itemcounts) 
                });
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
