export default function Home() {
    return (
        <div>
            <h1>Home</h1>
            <p>BrowserRouter + Routes/Route (BR) 학습</p>

            <ol>
                <li>
                    <b>1단계:</b> BrowserRouter와 Routes/Route를 사용해 여러 페이지(Home / Users / UserDetail)로
                    이동하는 기본 라우팅을 구성함
                </li>

                <li>
                    <b>2단계:</b> <code>/users/:userId</code> 형태의 동적 라우트를 사용해 URL 파라미터로 상세 페이지를
                    구현함
                </li>

                <li>
                    <b>3단계:</b> 페이지 컴포넌트 내부에서
                    <code>useEffect</code>를 사용해 JSONPlaceholder에서 데이터를 불러오고, 로딩/에러 상태를 컴포넌트
                    state로 직접 관리함
                </li>

                <li>
                    <b>4단계:</b> 삭제(DELETE)와 같은 데이터 변경 로직을 컴포넌트 이벤트(onClick)에서 직접 처리하고,
                    삭제 성공 후 <code>useNavigate</code>로 페이지 이동을 제어함
                </li>
            </ol>

            <p>
                BR 방식에서는 <b>데이터 로딩과 변경 로직이 각 페이지 컴포넌트 안에 집중</b>되어 있음
            </p>
        </div>
    );
}
