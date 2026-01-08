export default function Home() {
    return (
        <div>
            <h1>Home</h1>
            <p>createBrowserRouter + RouterProvider (CBR / Data Router) 3단계</p>
            <p>JSONPlaceholder 실데이터 로딩 (loader 기반)</p>

            <ol>
                <li>
                    <b>1단계:</b> CBR 라우터 구성(createBrowserRouter) + <code>&lt;RouterProvider /&gt;</code>로 라우팅
                    시작 (RootLayout + <code>&lt;Outlet /&gt;</code>로 중첩 라우트 렌더링)
                </li>
                <li>
                    <b>2단계:</b> 동적 라우트 <code>/users/:userId</code> 추가 (파라미터 기반 상세 페이지 이동)
                </li>
                <li>
                    <b>3단계:</b> 실데이터 fetch를 컴포넌트가 아니라 <b>loader</b>에서 수행 (목록: 이름만 / 상세:
                    id·name·email) + 에러는 <b>errorElement</b>로 처리
                </li>
                <li>
                    <b>4단계(예정):</b> <b>action</b>으로 “쓰기”(예: 삭제/수정) 처리 +{' '}
                    <b>submitting/redirect/revalidate</b> 흐름 학습
                </li>
            </ol>
        </div>
    );
}
