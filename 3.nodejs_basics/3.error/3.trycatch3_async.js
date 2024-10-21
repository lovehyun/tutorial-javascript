// 1. 프로미스 오류 처리 (비동기 코드)
async function fetchData() {
    try {
        let response = await fetch("https://api.example.com/data");
        if (!response.ok) {
            throw new Error(`HTTP 오류: ${response.status}`);
        }
        let data = await response.json();
        console.log("데이터:", data);
    } catch (error) {
        console.log("비동기 오류 처리:", error.message);
    }
}

fetchData();


// 2. 상세 오류 처리
async function fetchData2() {
    try {
        // 네트워크 요청
        let response = await fetch("https://api.example.com/data");

        // HTTP 상태 코드가 200~299가 아닐 때 처리
        if (!response.ok) {
            throw new Error(`HTTP 오류: ${response.status}`);
        }

        // JSON 파싱 시 오류 처리
        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            throw new Error('응답 데이터를 JSON으로 파싱하는 중 오류가 발생했습니다: ' + jsonError.message);
        }

        console.log("데이터:", data);
    } catch (error) {
        // 네트워크 오류 또는 기타 오류 처리
        console.log("비동기 오류 처리:", error.message);
    }
}

fetchData2();


// 3. 개선된 구조화된 코드
// 에러 처리와 데이터 처리 부분을 분리
async function fetchData3() {
    try {
        const response = await makeRequest("https://api.example.com/data");
        const data = await parseJSON(response);
        console.log("데이터:", data);
    } catch (error) {
        console.log("오류 처리:", error.message);
    }
}

async function makeRequest(url) {
    const response = await fetch(url);

    // HTTP 상태 코드 확인
    if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status}`);
    }
    return response;
}

// 더 세밀하게 추가도 가능...
// async function makeRequest(url) {
//     try {
//         const response = await fetch(url);
//
//         // HTTP 상태 코드 확인
//         if (!response.ok) {
//             throw new Error(`HTTP 오류: ${response.status}`);
//         }
//
//         return response;
//     } catch (error) {
//         // 네트워크 오류 또는 기타 fetch 관련 오류 처리
//         throw new Error('네트워크 오류: ' + error.message);
//     }
// }

async function parseJSON(response) {
    try {
        return await response.json();
    } catch (error) {
        throw new Error('JSON 파싱 오류: ' + error.message);
    }
}

fetchData3();

