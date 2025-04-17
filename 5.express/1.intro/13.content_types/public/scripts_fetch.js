const output = document.getElementById('output');

function printResponse(res) {
    output.textContent = JSON.stringify(res, null, 2);
}

async function sendJSON() {
    const data = document.getElementById('jsonInput').value;
    const res = await fetch('/submit-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
    });
    
    const reply = await res.json(); // 또는 send() 였으면 res.text();
    printResponse(reply);

    // printResponse(await res.json());
}

async function sendForm() {
    const name = document.getElementById('formName').value;
    const age = document.getElementById('formAge').value;

    // JSON 으로 변경해서 전송
    // const res = await fetch('/submit-form', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(jsonData)
    // });

    const params = new URLSearchParams();
    params.append('name', name);
    params.append('age', age);
    
    const res = await fetch('/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
    });

    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }

    printResponse(await res.json());
}

async function sendText() {
    const text = document.getElementById('textInput').value;
    const res = await fetch('/submit-text', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: text
    });
    printResponse(await res.json());
}

async function sendRaw() {
    const rawText = document.getElementById('rawInput').value;
    const encoder = new TextEncoder();
    const res = await fetch('/submit-raw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: encoder.encode(rawText)
    });
    printResponse(await res.json());
}

async function sendMultipart() {
    const name = document.getElementById('multipartName').value;
    const file = document.getElementById('fileInput').files[0];
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);
    const res = await fetch('/upload', {
        method: 'POST',
        body: formData
    });
    printResponse(await res.json());
}
