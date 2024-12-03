import React, { useState } from "react";

const App = () => {
    const [data, setData] = useState(null); // 로드된 데이터

    // 데이터 로드 함수
    const loadData = async () => {
        // 랜덤 ID로 API 요청
        const randomId = Math.floor(Math.random() * 10) + 1;
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${randomId}`);
            const result = await response.json();
            setData(result); // 데이터 상태 업데이트
        } catch (error) {
            setData({ error: true }); // 에러 상태
        }
    };

    const renderData = () => {
        if (!data) {
            return <p>No data loaded.</p>
        }
        if (data.error) {
            return <p style={{ color: "red" }}>데이터 로딩에 실패하였습니다.</p>
        }
        return (
            <div>
                <h3>{data.title}</h3>
                <p>{data.body}</p>
            </div>
        );
    }

    // 방법1. 삼항연산자
    return (
        <div style={{ padding: "20px" }}>
            {/* 버튼 */}
            <button onClick={loadData}>Load Data</button>

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

    // 방법2. IIFE, Immediately Invoked Function Expression (() => {}());
    return (
        <div style={{ padding: "20px" }}>
            {/* 버튼 */}
            <button onClick={loadData}>Load Data</button>

            {/* 데이터 출력 영역 */}
            <div style={{ marginTop: "20px" }}>
                {(() => {
                    if (!data) {
                        return <p>No data loaded.</p>;
                    }

                    if (data.error) {
                        return <p style={{ color: "red" }}>Failed to load data. Please try again.</p>;
                    }

                    return (
                        <div>
                            <h3>{data.title}</h3>
                            <p>{data.body}</p>
                        </div>
                    );
                })()}
            </div>
        </div>
    );

    // 방법3. 함수 호출
    return (
        <div style={{ marginTop: "20px" }}>{renderContent()}</div>
    );

};

export default App;
