-- 목적: WHERE 조건(비교/AND/OR/BETWEEN)

-- Q: 서울에 사는 고객만?
SELECT Id, Name, Address
FROM users
WHERE Address = 'Seoul';

-- Q: 25세 이상 고객?
SELECT Id, Name, Age
FROM users
WHERE Age >= 25
ORDER BY Age DESC;

-- Q: 20대 여성?
SELECT Id, Name, Gender, Age
FROM users
WHERE Gender='F' AND Age BETWEEN 20 AND 29
ORDER BY Age;
