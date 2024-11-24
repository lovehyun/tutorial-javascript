require('dotenv').config(); // .env 파일 로드
const { MongoClient } = require('mongodb');

// 환경 변수에서 MongoDB URI와 컬렉션 이름 가져오기
const uri = process.env.MONGODB_URI;
const collectionName = process.env.COLLECTION_NAME;

if (!uri || !collectionName) {
    console.error('MONGODB_URI 또는 COLLECTION_NAME이 .env 파일에 정의되지 않았습니다.');
    process.exit(1);
}

// CRUD 함수
async function main() {
    const client = new MongoClient(uri); // MongoClient 생성

    try {
        // MongoDB 연결
        await client.connect();
        console.log('MongoDB 연결 성공!');

        // 데이터베이스와 컬렉션 선택
        const dbName = uri.split('/').pop(); // URI에서 데이터베이스 이름 추출
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // **CREATE**: 데이터 삽입
        const insertResult = await collection.insertOne({ name: 'Alice', age: 25, city: 'Seoul' });
        console.log('데이터 삽입 결과:', insertResult.insertedId);

        // **READ**: 데이터 조회
        const findResult = await collection.findOne({ name: 'Alice' });
        console.log('데이터 조회 결과:', findResult);

        // **UPDATE**: 데이터 업데이트
        const updateResult = await collection.updateOne(
            { name: 'Alice' }, // 조건
            { $set: { age: 26 } } // 업데이트 내용
        );
        console.log('데이터 업데이트 결과:', updateResult.modifiedCount);

        // **DELETE**: 데이터 삭제
        const deleteResult = await collection.deleteOne({ name: 'Alice' });
        console.log('데이터 삭제 결과:', deleteResult.deletedCount);
    } catch (error) {
        console.error('MongoDB 작업 중 오류 발생:', error);
    } finally {
        // 연결 닫기
        await client.close();
        console.log('MongoDB 연결 종료');
    }
}

// 함수 실행
main().catch(console.error);
