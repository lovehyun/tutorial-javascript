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

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch('http://localhost:5000/api/data');
    //             const data = await response.json();
    //             setData(data.message); // 서버에서 받은 메시지를 상태에 저장
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };
    //     fetchData(); // 비동기 함수 호출
    // }, []); // 의존성 배열

    return (
        <div>
            <h1>React + Express Integration</h1>
            <p>Data from server: {data}</p>
        </div>
    );
}

export default App;
