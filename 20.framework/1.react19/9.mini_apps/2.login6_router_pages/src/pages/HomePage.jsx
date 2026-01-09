import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <div style={{ padding: 16, borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)' }}>
            <h3 style={{ marginTop: 0 }}>Home</h3>
            <p style={{ opacity: 0.8 }}>
                이 프로젝트는 <b>라우터</b> 와 <b>로그인 성공 시 이동</b>만 적용된 상태입니다.
            </p>
            <p style={{ marginBottom: 0 }}>
                <Link to="/login">로그인 하러 가기</Link>
            </p>
        </div>
    );
}
