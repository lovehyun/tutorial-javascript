// MongoDB 라이브러리 불러오기
const { MongoClient } = require('mongodb');

// MongoDB URI 및 데이터베이스 이름 설정
const uri = 'mongodb://localhost:27017'; // 로컬 MongoDB 서버
const dbName = 'myDatabase'; // 사용할 데이터베이스 이름

// MongoDB 연결 함수
async function main() {
    // MongoClient 인스턴스 생성
    const client = new MongoClient(uri);

    try {
        // MongoDB에 연결
        await client.connect();
        console.log('MongoDB에 연결 성공!');

        // 데이터베이스 선택
        const db = client.db(dbName);

        // 컬렉션 선택
        const collection = db.collection('myCollection');

        // 데이터 삽입 (CREATE)
        const insertResult = await collection.insertOne({ name: 'John Doe', age: 30 });
        console.log('삽입 결과:', insertResult);

        // 데이터 조회 (READ)
        const findResult = await collection.findOne({ name: 'John Doe' });
        console.log('조회 결과:', findResult);

        // 데이터 업데이트 (UPDATE)
        const updateResult = await collection.updateOne(
            { name: 'John Doe' },
            { $set: { age: 31 } }
        );
        console.log('업데이트 결과:', updateResult);

        // 데이터 삭제 (DELETE)
        const deleteResult = await collection.deleteOne({ name: 'John Doe' });
        console.log('삭제 결과:', deleteResult);
    } catch (error) {
        console.error('MongoDB 작업 중 오류 발생:', error);
    } finally {
        // 연결 닫기
        await client.close();
        console.log('MongoDB 연결 종료');
    }
}

// MongoDB 연결 함수 호출
main().catch(console.error);
