// curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"name": "Alice", "email": "alice@example.com"}'
// curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"name": "Bob", "email": "bob@example.com"}'

// curl -X POST localhost:3000/users -H "Content-Type: application/json" -d "{\"name\": \"Alice\", \"email\": \"alice@example.com\"}"
// curl -X POST localhost:3000/users -H "Content-Type: application/json" -d "{\"name\": \"Bob\", \"email\": \"bob@example.com\"}"

// curl -X GET http://localhost:3000/users

// curl -X DELETE http://localhost:3000/users/1
// curl -X DELETE http://localhost:3000/users/0

// npm install axios  (타입 설치 불필요)
// axios가 자체적으로 index.d.ts 타입 정의 파일을 제공함

import axios from 'axios';

const baseURL = 'http://localhost:3000/users';

async function runTests() {
    try {
        // CREATE: 사용자 추가
        console.log('Testing CREATE (POST /users)...');
        const createUser1 = await axios.post(baseURL, {
            name: 'Alice',
            email: 'alice@example.com',
        });
        console.log('Created User 1:', createUser1.data);

        const createUser2 = await axios.post(baseURL, {
            name: 'Bob',
            email: 'bob@example.com',
        });
        console.log('Created User 2:', createUser2.data);

        // READ: 사용자 목록 조회
        console.log('\nTesting READ (GET /users)...');
        const listaUsers = await axios.get(baseURL);
        console.log('User List:', listaUsers.data);

        // UPDATE: 사용자 정보 수정 (예제 API에는 없지만, 작성 가능)
        // (여기서는 생략하지만 필요하면 구현)

        // DELETE: 사용자 삭제
        console.log('\nTesting DELETE (DELETE /users/:id)...');
        const userIdToDelete = createUser1.data.id;
        await axios.delete(`${baseURL}/${userIdToDelete}`);
        console.log(`Deleted User with ID: ${userIdToDelete}`);

        // READ: 사용자 목록 재확인
        console.log('\nTesting READ after DELETE (GET /users)...');
        const listAfterDeleteResponse = await axios.get(baseURL);
        console.log('Updated User List:', listAfterDeleteResponse.data);

        // DELETE ALL: 모든 사용자 삭제
        console.log('\nTesting DELETE ALL (DELETE /users)...');
        await axios.delete(baseURL);
        console.log('All users deleted.');

        // READ: 확인용 조회
        console.log('\nTesting READ after cleanup (GET /users)...');
        const emptyListResponse = await axios.get(baseURL);
        console.log('Final User List:', emptyListResponse.data);

        console.log('\nAll tests completed successfully!');
    // } catch (error: any) {
    //     console.error('Error during testing:', error.response?.data || error.message);
    // }
    } catch (error: any) {
    // } catch (error: unknown) {
        console.error('Error: ', error.toJSON());
        // if (axios.isAxiosError(error)) {
        //     console.error('Axios Error:', error.code); // AxiosError 처리
        // } else if (error instanceof Error) {
        //     console.error('General Error:', error.message); // 일반 Error 처리
        // } else {
        //     console.error('Unexpected error:', error); // 기타 타입 처리
        // }
    }
}

runTests();
