import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [data, setData] = useState(null);       // 로드된 데이터
    const [clearing, setClearing] = useState(false); // 클리어 상태

    // 데이터 로드 함수
    const loadData = async () => {
        setLoading(true); // 로딩 상태 시작
        setClearing(false); // 클리어 상태 초기화

        // 1초 대기
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // 랜덤 ID로 API 요청
        const randomId = Math.floor(Math.random() * 10) + 1;
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${randomId}`);
            const result = await response.json();
            setData(result); // 데이터 상태 업데이트
        } catch (error) {
            setData({ error: true }); // 에러 상태 업데이트
        } finally {
            setLoading(false); // 로딩 상태 종료
        }
    };

    // 데이터 클리어 함수
    const clearData = async () => {
        setClearing(true); // 클리어 상태 시작

        // 1초 대기
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setData(null); // 데이터 초기화
        setClearing(false); // 클리어 상태 종료
    };

    return (
        <div className="container my-4">
            {/* 로딩 버튼 */}
            <button
                className="btn btn-primary"
                type="button"
                onClick={loadData}
                disabled={loading || clearing}
            >
                {loading ? (
                    <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        {" "}Loading...
                    </>
                ) : (
                    "Load Data"
                )}
            </button>

            {/* 클리어 버튼 */}
            <button
                className="btn btn-danger ms-2"
                type="button"
                onClick={clearData}
                disabled={loading || clearing || data === null}
            >
                {clearing ? (
                    <>
                        <span className="spinner-border spinner-border-sm text-light"></span>
                        {" "}Clearing...
                    </>
                ) : (
                    "Clear"
                )}
            </button>

            {/* 데이터 출력 영역 */}
            <div className="mt-4">
                {data ? (
                    data.error ? (
                        <div className="alert alert-danger">
                            Failed to load data. Please try again.
                        </div>
                    ) : (
                        <div className="alert alert-success">
                            <h5>{data.title}</h5>
                            <p>{data.body}</p>
                        </div>
                    )
                ) : (
                    <div className="alert alert-secondary">
                        No data loaded.
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
