import { Link, useRouteError } from 'react-router-dom';

export default function NotFound() {
    const err = useRouteError();

    return (
        <>
            <h1>404 / 에러</h1>
            <p>요청한 페이지가 없거나 라우팅 중 문제가 발생했습니다.</p>
            {err && <pre style={{ whiteSpace: 'pre-wrap' }}>{String(err)}</pre>}
            <Link to="/">홈으로</Link>
        </>
    );
}
