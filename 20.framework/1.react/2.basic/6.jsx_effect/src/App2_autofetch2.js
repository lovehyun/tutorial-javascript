import React, { useState, useEffect } from "react";

const App = () => {
    const [count, setCount] = useState(1);
    const [data, setData] = useState(null);

    // count가 변경될 때 데이터를 로드
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${count}`);
            const result = await response.json();
            setData(result);
        };

        fetchData();
    }, [count]); // count가 변경될 때 실행

    return (
        <div>
            <button onClick={() => setCount(count + 1)}>Next</button>
            <h3>{data ? data.title : "Loading..."}</h3>
            <p>{data ? data.body : ""}</p>
        </div>
    );
};

export default App;
