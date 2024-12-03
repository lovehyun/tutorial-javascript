import React, { useState } from "react";

const App = () => {
    const [data, setData] = useState(null); // 로드된 데이터

    // 데이터 로드 함수
    const loadData = async () => {
        const randomId = Math.floor(Math.random() * 10) + 1; // 랜덤 ID 생성
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${randomId}`);
        const result = await response.json();
        setData(result); // 데이터 상태 업데이트
    };

    // loadData();

    return (
        <div style={{ padding: "20px" }}>
            {/* 버튼 */}
            <button onClick={loadData}>Load Data</button>

            {/* 데이터 출력 영역 */}
            <div style={{ marginTop: "20px" }}>
                {data ? (
                    <div>
                        <h3>{data.title}</h3>
                        <p>{data.body}</p>
                    </div>
                ) : (
                    <p>No data loaded.</p>
                )}
            </div>
        </div>
    );
};

export default App;
