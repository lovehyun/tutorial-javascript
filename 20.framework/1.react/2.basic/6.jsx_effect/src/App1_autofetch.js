import React, { useState, useEffect } from "react";

const App = () => {
    const [data, setData] = useState(null);

    // 처음 렌더링될 때 데이터를 로드
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/1`);
            const result = await response.json();
            setData(result);
        };

        fetchData();
    }, []); // 빈 배열: 컴포넌트가 처음 렌더링될 때 한 번 실행

    return (
        <div>
            <h3>{data ? data.title : "Loading..."}</h3>
            <p>{data ? data.body : ""}</p>
        </div>
    );
};

export default App;
