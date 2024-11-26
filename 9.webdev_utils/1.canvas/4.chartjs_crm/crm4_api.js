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

    // 1. 연령대별 사람 수
    // SELECT
    //     (Age / 10) * 10 AS AgeGroup, -- 연령대 계산
    //     COUNT(*) AS UserCount                     -- 연령대별 사용자 수 계산
    // FROM users
    // GROUP BY AgeGroup
    // ORDER BY AgeGroup;

    // 2. 연령대별 성별 사람 수 (CAST는 옵셔널, WHERE도 옵셔널)
   // SELECT
    //     CAST(Age AS INTEGER) / 10 * 10 AS AgeGroup, -- 연령대 계산
    //     Gender,                                    -- 성별 구분
    //     COUNT(*) AS UserCount                      -- 연령대 및 성별별 사용자 수 계산
    // FROM users
    // WHERE Age IS NOT NULL AND Age != ''           -- 나이가 NULL이거나 비어있는 값 제외
    // GROUP BY AgeGroup, Gender                      -- 연령대 및 성별로 그룹화
    // ORDER BY AgeGroup, Gender;

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
            // 방법1.
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
            
            // 방법2. reduce 를 통한 간단한(?) 코드
            // const ageGroups = rows.reduce((acc, { AgeGroup, Gender, Count }) => {
            //     acc[AgeGroup] = acc[AgeGroup] || { male: 0, female: 0 };
            //     acc[AgeGroup][Gender.toLowerCase()] = Count; // 'Male' -> 'male', 'Female' -> 'female'
            //     return acc;
            // }, {});
            // 
            // const chartData = {
            //     labels: Object.keys(ageGroups),
            //     maleCounts: Object.keys(ageGroups).map(key => ageGroups[key].male),
            //     femaleCounts: Object.keys(ageGroups).map(key => ageGroups[key].female)
            // };

            console.log(chartData);
            // {
            //     labels: [ '10대', '20대', '30대', '40대', '50대' ],
            //     maleCounts: [ 100, 124, 128, 107, 29 ],
            //     femaleCounts: [ 101, 135, 126, 117, 33 ]
            // }

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
