// Promise를 반환하는 함수들
function fetchData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("1. 데이터 가져오기");
            resolve("데이터");
        }, 1000);
    });
}

function processData(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`2. 데이터 처리: ${data}`);
            resolve(`${data} 처리됨`);
        }, 1000);
    });
}

function saveData(processedData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`3. 데이터 저장: ${processedData}`);
            resolve("저장 성공");
        }, 1000);
    });
}

// async/await로 처리
async function handleData() {
    try {
        const data = await fetchData();
        const processedData = await processData(data);
        const result = await saveData(processedData);
        console.log(`결과: ${result}`);
    } catch (error) {
        console.error(`오류 발생: ${error}`);
    }
}

handleData();
