import React, { useState, useEffect } from 'react';
import api from './api';

function App() {
    const [data, setData] = useState([]);

    useEffect(() => {
        // 예시로 데이터를 불러오는 API 요청
        api.get('/api/data')
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div>
            <h1>React Frontend</h1>
            <ul>
                {data.map((item) => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;
