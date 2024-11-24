require('dotenv').config(); // .env 파일 로드
const { MongoClient } = require('mongodb');

// 환경 변수에서 MongoDB URI 가져오기
const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('MONGODB_URI가 .env 파일에 정의되지 않았습니다.');
    process.exit(1);
}

// **데이터 삽입 함수**
async function insertUsers() {
    const client = new MongoClient(uri); // MongoClient 생성

    try {
        // MongoDB 연결
        await client.connect();
        console.log('MongoDB 연결 성공!');

        // 데이터베이스와 컬렉션 선택
        const dbName = uri.split('/').pop(); // URI에서 데이터베이스 이름 추출
        const db = client.db(dbName);
        const collection = db.collection('users');

        // 10개의 사용자 데이터 삽입
        const users = [
            { name: 'Alice', age: 25, city: 'Seoul' },
            { name: 'Bob', age: 30, city: 'Busan' },
            { name: 'Charlie', age: 28, city: 'Incheon' },
            { name: 'David', age: 35, city: 'Daegu' },
            { name: 'Eve', age: 22, city: 'Gwangju' },
            { name: 'Frank', age: 33, city: 'Daejeon' },
            { name: 'Grace', age: 29, city: 'Ulsan' },
            { name: 'Hank', age: 40, city: 'Jeju' },
            { name: 'Ivy', age: 27, city: 'Suwon' },
            { name: 'Jack', age: 26, city: 'Pohang' },
        ];

        const insertResult = await collection.insertMany(users);
        console.log('데이터 삽입 결과:', insertResult.insertedCount, '개의 문서가 삽입되었습니다.');
    } catch (error) {
        console.error('데이터 삽입 중 오류 발생:', error);
    } finally {
        // 연결 닫기
        await client.close();
        console.log('MongoDB 연결 종료');
    }
}

// **데이터 조회 함수**
async function fetchUsers() {
    const client = new MongoClient(uri); // MongoClient 생성

    try {
        // MongoDB 연결
        await client.connect();
        console.log('MongoDB 연결 성공!');

        // 데이터베이스와 컬렉션 선택
        const dbName = uri.split('/').pop(); // URI에서 데이터베이스 이름 추출
        const db = client.db(dbName);
        const collection = db.collection('users');

        // 모든 사용자 데이터 조회
        const cursor = collection.find({});
        const users = await cursor.toArray(); // 결과를 배열로 변환

        console.log('조회된 사용자 데이터:');
        users.forEach((user, index) => {
            console.log(`사용자 ${index + 1}:`, user);
        });
    } catch (error) {
        console.error('데이터 조회 중 오류 발생:', error);
    } finally {
        // 연결 닫기
        await client.close();
        console.log('MongoDB 연결 종료');
    }
}

// **검색 및 정렬 예제 함수**
async function queryUsers() {
    const client = new MongoClient(uri); // MongoClient 생성

    try {
        // MongoDB 연결
        await client.connect();
        console.log('MongoDB 연결 성공!');

        // 데이터베이스와 컬렉션 선택
        const dbName = uri.split('/').pop(); // URI에서 데이터베이스 이름 추출
        const db = client.db(dbName);
        const collection = db.collection('users');

        // **1. 이름이 "Alice"인 사용자 검색**
        const findAlice = await collection.findOne({ name: 'Alice' });
        console.log('이름이 Alice인 사용자:', findAlice);

        // **2. 나이가 30 이상인 사용자 검색**
        const olderThan30 = await collection.find({ age: { $gte: 30 } }).toArray();
        console.log('나이가 30 이상인 사용자:');
        olderThan30.forEach(user => console.log(user));

        // **3. 검색된 사용자 갯수 제한 (최대 5명)**
        const limitedUsers = await collection.find({}).limit(5).toArray();
        console.log('최대 5명의 사용자:');
        limitedUsers.forEach(user => console.log(user));

        // **4. 이름순으로 정렬**
        const nameSorted = await collection.find({}).sort({ name: 1 }).toArray();
        console.log('이름순 정렬 결과:');
        nameSorted.forEach(user => console.log(user));

        // **5. 나이순으로 정렬 (내림차순)**
        const ageSortedDesc = await collection.find({}).sort({ age: -1 }).toArray();
        console.log('나이순 정렬 결과 (내림차순):');
        ageSortedDesc.forEach(user => console.log(user));

        // **6. 이름에 "a"가 포함된 사용자 검색**
        const nameContainsA = await collection.find({ name: /a/i }).toArray(); // 대소문자 무시
        console.log('이름에 "a"가 포함된 사용자:');
        nameContainsA.forEach(user => console.log(user));
    } catch (error) {
        console.error('사용자 검색 중 오류 발생:', error);
    } finally {
        // 연결 닫기
        await client.close();
        console.log('MongoDB 연결 종료');
    }
}

// **특정 필드만 선택적으로 출력**
async function queryWithProjection() {
    const client = new MongoClient(uri);

    try {
        // MongoDB 연결
        await client.connect();
        console.log('MongoDB 연결 성공!');

        // 데이터베이스와 컬렉션 선택
        const dbName = uri.split('/').pop(); // URI에서 데이터베이스 이름 추출
        const db = client.db(dbName);
        const collection = db.collection('users');

        // **1. 이름과 나이만 출력 (_id 제외)**
        const nameAndAge = await collection.find({}, { projection: { name: 1, age: 1, _id: 0 } }).toArray();
        console.log('이름과 나이만 출력:');
        nameAndAge.forEach(user => console.log(user));

        // **2. 도시(city)만 출력**
        const cities = await collection.find({}, { projection: { city: 1, _id: 0 } }).toArray();
        console.log('도시만 출력:');
        cities.forEach(city => console.log(city));

        // **3. 이름 제외하고 나머지 필드 출력**
        const withoutName = await collection.find({}, { projection: { name: 0 } }).toArray();
        console.log('이름 제외하고 출력:');
        withoutName.forEach(user => console.log(user));
    } catch (error) {
        console.error('Projection 쿼리 중 오류 발생:', error);
    } finally {
        // 연결 닫기
        await client.close();
        console.log('MongoDB 연결 종료');
    }
}

// 함수 호출
(async function () {
    // await insertUsers(); // 데이터 삽입
    // await fetchUsers();  // 데이터 조회
})();

// queryUsers().catch(console.error);
queryWithProjection().catch(console.error);
