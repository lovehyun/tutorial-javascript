export default function Home() {
    return (
        <div>
            <h1>Home</h1>
            <p>BrowserRouter + Routes/Route (BR) 3단계 요약</p>

            <ol>
                <li>
                    <b>1단계:</b> 정적 라우트(Home / Users / About) 만들고 이동해보기 (Outlet 개념 포함)
                </li>
                <li>
                    <b>2단계:</b> 동적 라우트 <code>/users/:userId</code> 추가 + 목록→상세 이동(파라미터 읽기)
                </li>
                <li>
                    <b>3단계:</b> JSONPlaceholder에서 실데이터 fetch + 로딩/에러 처리(목록: 이름만, 상세: id/name/email)
                </li>
                <li>
                    <b>4단계(예정):</b> 캐시/중복요청 개선 또는 “삭제/수정” 같은 쓰기 기능 추가(그리고 CBR과 비교)
                </li>
            </ol>
        </div>
    );
}
