// npm install node-fetch@2
const fetch = require('node-fetch');
const axios = require('axios');

// Fetch API 사용 예제
async function fetchExample() {
    try {
        console.log('=== Fetch Example ===');
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetch Response Data:', data);
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

// Axios 사용 예제
async function axiosExample() {
    try {
        console.log('=== Axios Example ===');
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
        console.log('Axios Status Code:', response.status);
        console.log('Axios Response Data:', response.data);
    } catch (error) {
        console.error('Axios Error:', error);
    }
}

// 실행
(async () => {
    await fetchExample();
    await axiosExample();
})();
