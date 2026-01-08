import { Link, useRouteError } from 'react-router-dom';

export default function NotFound() {
    const err = useRouteError(); // loader에서 throw된 에러/Response도 여기로 옴

    // 라우트 에러(404 등) 정보를 간단히 표시
    const status = err?.status;
    const message = err?.statusText || err?.message;

    return (
        <div>
            <h1>Not Found</h1>
            {status && <p>status: {status}</p>}
            {message && <p>{message}</p>}

            <Link to="/users">Users로 이동</Link>
        </div>
    );
}
