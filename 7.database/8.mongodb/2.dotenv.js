// 필요한 라이브러리 불러오기
require('dotenv').config(); // .env 파일 로드
const { MongoClient } = require('mongodb');

// 환경 변수에서 MongoDB URI 가져오기
const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('MONGODB_URI가 .env 파일에 정의되지 않았습니다.');
    process.exit(1); // 프로그램 종료
}

// MongoDB 연결 함수
async function connectToMongoDB() {
    const client = new MongoClient(uri); // MongoClient 생성

    try {
        // MongoDB 연결
        await client.connect();
        console.log('MongoDB에 성공적으로 연결되었습니다!');

        // 데이터베이스 이름 추출 및 사용
        const dbName = uri.split('/').pop(); // URI에서 데이터베이스 이름 가져오기
        const db = client.db(dbName);

        // CRUD 예제 (선택 사항)
        const collection = db.collection('myCollection');
        const result = await collection.insertOne({ name: 'Alice', age: 25 });
        console.log('데이터 삽입 결과:', result);
    } catch (error) {
        console.error('MongoDB 연결 중 오류 발생:', error);
    } finally {
        // 연결 닫기
        await client.close();
        console.log('MongoDB 연결 종료');
    }
}

// MongoDB 연결 시도
connectToMongoDB().catch(console.error);
