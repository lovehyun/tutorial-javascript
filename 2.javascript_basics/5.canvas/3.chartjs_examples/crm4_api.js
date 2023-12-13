const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'monthly_revenue4.html'));
});

app.get('/chart_data', (req, res) => {
    const db = new sqlite3.Database('crm.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Connected to the database.');
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
        [], (err, rows) => {
            if (err) {
                console.error(err.message);
            } else {
                // 데이터 포맷 변환
                const labels = [];
                const revenues = [];
                
                for (const row of rows) {
                    labels.push(row.YearMonth);
                    revenues.push(row.MonthlyRevenue);
                }

                // JSON 데이터 생성
                const chartData = {
                    labels: labels,
                    revenues: revenues
                };

                res.json(chartData);
            }
        }
    );

    db.close((err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Closed the database connection.');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
