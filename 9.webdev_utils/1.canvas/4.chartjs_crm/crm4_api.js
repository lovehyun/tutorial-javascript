const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'monthly_revenue4.html'));
});

app.get('/revenue_data', (req, res) => {
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
            "orders"."OrderAt" >= '2023-01-01' AND "orders"."OrderAt" <= '2023-12-31'
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

app.get('/gender_dist_data', (req, res) => {
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
            CASE
                WHEN Age BETWEEN 10 AND 19 THEN '10대'
                WHEN Age BETWEEN 20 AND 29 THEN '20대'
                WHEN Age BETWEEN 30 AND 39 THEN '30대'
                WHEN Age BETWEEN 40 AND 49 THEN '40대'
                WHEN Age BETWEEN 50 AND 59 THEN '50대'
                WHEN Age >= 60 THEN '60대 이상'
                ELSE '기타'
            END AS AgeGroup,
            Gender,
            COUNT(*) AS Count
        FROM 
            users
        GROUP BY 
            AgeGroup, Gender
        ORDER BY 
            AgeGroup, Gender
    `, 
    [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        } else {
            console.log(rows);
            // 데이터 포맷 변환
            const ageGroups = {};
            
            for (const row of rows) {
                const ageGroup = row.AgeGroup;
                const gender = row.Gender;
                const count = row.Count;

                if (!ageGroups[ageGroup]) {
                    ageGroups[ageGroup] = { male: 0, female: 0 };
                }

                if (gender === 'Male') {
                    ageGroups[ageGroup].male = count;
                } else if (gender === 'Female') {
                    ageGroups[ageGroup].female = count;
                }
            }

            // JSON 데이터 생성
            const chartData = {
                labels: Object.keys(ageGroups),
                maleCounts: Object.values(ageGroups).map(group => group.male),
                femaleCounts: Object.values(ageGroups).map(group => group.female)
            };

            console.log(chartData);

            res.json(chartData);
        }
    });

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
