const output = document.getElementById('output');

function printResponse(data) {
    output.textContent = JSON.stringify(data, null, 2);
}

async function sendJSON() {
    try {
        const data = document.getElementById('jsonInput').value;
        const res = await axios.post('/submit-json', JSON.parse(data), {
            headers: { 'Content-Type': 'application/json' }
        });
        printResponse(res.data);
    } catch (error) {
        handleError(error);
    }
}

async function sendForm() {
    try {
        const name = document.getElementById('formName').value;
        const age = document.getElementById('formAge').value;

        // JSON 으로 변환해서 보내기도 가능
        // const jsonData = {
        //     name: name,
        //     age: age
        // };

        // const res = await axios.post('/submit-form', jsonData, {
        //     headers: { 'Content-Type': 'application/json' }
        // });
        
        // URLSearchParams포멧(key=value) 형태로 객체 생성
        const params = new URLSearchParams();
        params.append('name', name);
        params.append('age', age);
        const res = await axios.post('/submit-form', params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        
        printResponse(res.data);
    } catch (error) {
        handleError(error);
    }
}

async function sendText() {
    try {
        const text = document.getElementById('textInput').value;
        const res = await axios.post('/submit-text', text, {
            headers: { 'Content-Type': 'text/plain' }
        });
        printResponse(res.data);
    } catch (error) {
        handleError(error);
    }
}

async function sendRaw() {
    try {
        const rawText = document.getElementById('rawInput').value;
        const res = await axios.post('/submit-raw', rawText, {
            headers: { 'Content-Type': 'application/octet-stream' },
            transformRequest: [(data) => data] // 데이터 변환 방지
        });
        printResponse(res.data);
    } catch (error) {
        handleError(error);
    }
}

async function sendMultipart() {
    try {
        const name = document.getElementById('multipartName').value;
        const file = document.getElementById('fileInput').files[0];
        const formData = new FormData();
        formData.append('name', name);
        if (file) {
            formData.append('file', file);
        }
        const res = await axios.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        printResponse(res.data);
    } catch (error) {
        handleError(error);
    }
}

function handleError(error) {
    console.error('Error:', error);
    if (error.response) {
        // 서버가 응답을 반환했지만 2xx 범위가 아닌 경우
        printResponse({
            error: true,
            status: error.response.status,
            data: error.response.data
        });
    } else if (error.request) {
        // 요청이 이루어졌지만 응답을 받지 못한 경우
        printResponse({
            error: true,
            message: '서버로부터 응답이 없습니다.'
        });
    } else {
        // 요청 설정 중에 오류가 발생한 경우
        printResponse({
            error: true,
            message: error.message
        });
    }
}
