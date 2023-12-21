// src/App.js 파일

import React, { useEffect, useState } from 'react';

function App() {
    const [data, setData] = useState('');

    useEffect(() => {
        // Express 서버에서 데이터 가져오기
        fetch('http://localhost:5000/api/data')
            .then((response) => response.json())
            .then((data) => setData(data.message))
            .catch((error) => console.error('Error fetching data:', error));
    }, []); // 의존성변수

    return (
        <div>
            <h1>React + Express Integration</h1>
            <p>Data from server: {data}</p>
        </div>
    );
}

export default App;
