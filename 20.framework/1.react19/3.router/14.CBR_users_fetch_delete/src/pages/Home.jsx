export default function Home() {
    return (
        <div>
            <h1>Home</h1>
            <p>createBrowserRouter + Data Router (CBR) 학습</p>

            <ol>
                <li>
                    <b>1단계:</b> createBrowserRouter와 RouterProvider를 사용해 라우트를 하나의 설정 객체로 정의하고,
                    RootLayout + Outlet 구조로 페이지를 렌더링함
                </li>

                <li>
                    <b>2단계:</b> <code>/users/:userId</code> 동적 라우트와 loader를 사용해 상세 페이지 진입 시 필요한
                    데이터를 라우터 단계에서 미리 준비함
                </li>

                <li>
                    <b>3단계:</b> 데이터 로딩(fetch)을 컴포넌트가 아니라
                    <b>loader</b>에서 처리하고, 로딩/에러 상태는 React Router가 관리하도록 위임함
                </li>

                <li>
                    <b>4단계:</b> 삭제와 같은 데이터 변경 작업을
                    <b>action</b>으로 분리하고, Form 제출 → action 실행 → redirect 흐름으로 페이지 이동과 데이터
                    재검증을 라우터가 처리하도록 함
                </li>
            </ol>

            <p>
                CBR 방식에서는 <b>데이터의 흐름(조회/변경)을 라우터가 책임지고, 컴포넌트는 화면 표현에 집중</b>함
            </p>
        </div>
    );
}
