// src/pages/Home.jsx
// - CBR 학습 흐름에 5단계(Posts 페이지네이션)를 기록합니다.

export default function Home() {
    return (
        <div>
            <h1>Home</h1>

            <p>createBrowserRouter (CBR) 학습 진행 상황</p>

            <ol>
                <li>
                    <b>1단계:</b> 라우트 구성(Home/Users/About) 및 페이지 이동
                </li>
                <li>
                    <b>2단계:</b> 동적 라우트(<code>/users/:userId</code>)로 상세 페이지 이동
                </li>
                <li>
                    <b>3단계:</b> JSONPlaceholder 실데이터 로딩 + 로딩/에러 처리
                </li>
                <li>
                    <b>4단계:</b> (기존 흐름 유지) 라우팅 구성 확장/정리
                </li>
                <li>
                    <b>5단계:</b> <code>/posts</code>에서 posts 100개를 1회 로딩 후, 20개씩 클라이언트 slice로
                    페이지네이션(총 5페이지)
                </li>
            </ol>

            <p style={{ color: '#666' }}>
                ※ 5단계는 "페이지네이션 경험"에만 집중합니다. (상세/댓글/캐시는 다음 단계에서)
            </p>
        </div>
    );
}
