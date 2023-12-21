import React, { useState, useEffect } from 'react';
import Hello from './Hello';
import Click from './Click';
import api from './api';

function App() {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);

    useEffect(() => {
        // 예시로 데이터를 불러오는 API 요청
        api.get('/api/data')
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []); // 의존성변수

    const handleButtonClick = () => {
        setCount(count + 1);
    };

    const handleResetClick = () => {
        setCount(0);
    };

    return (
        <div>
            <h1>React Frontend</h1>
            <ul>
                {data.map((item) => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
            <Hello />
            <Click onButtonClick={handleButtonClick} onResetClick={handleResetClick} />
            <p>You clicked {count} times</p>
        </div>
    );
}

export default App;
