import React, { useState } from "react";

const App = () => {
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [data, setData] = useState(null);       // 로드된 데이터
    const [clearing, setClearing] = useState(false); // 클리어 상태

    // 데이터 로드 함수
    const loadData = async () => {
        setLoading(true);

        // 1초 대기
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // 랜덤 ID로 API 요청
        const randomId = Math.floor(Math.random() * 10) + 1;
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${randomId}`);
            const result = await response.json();
            setData(result); // 데이터 상태 업데이트
        } catch (error) {
            setData({ error: true });
        } finally {
            setLoading(false);
        }
    };

    // 데이터 클리어 함수
    const clearData = async () => {
        setClearing(true);

        // 1초 대기
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setData(null);
        setClearing(false);
    };

    return (
        <div style={{ padding: "20px" }}>
            {/* 로딩 버튼 */}
            <button onClick={loadData} disabled={loading || clearing}>
                {loading ? "Loading..." : "Load Data"}
            </button>

            {/* 클리어 버튼 */}
            <button
                onClick={clearData}
                disabled={loading || clearing || data === null}
                style={{ marginLeft: "10px" }}
            >
                {clearing ? "Clearing..." : "Clear"}
            </button>

            {/* 데이터 출력 영역 */}
            <div style={{ marginTop: "20px" }}>
                {data ? (
                    data.error ? (
                        <p style={{ color: "red" }}>Failed to load data. Please try again.</p>
                    ) : (
                        <div>
                            <h3>{data.title}</h3>
                            <p>{data.body}</p>
                        </div>
                    )
                ) : (
                    <p>No data loaded.</p>
                )}
            </div>
        </div>
    );
};

export default App;
