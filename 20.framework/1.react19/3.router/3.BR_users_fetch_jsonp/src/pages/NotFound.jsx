import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div>
            <h1>404 / Not Found</h1>
            <p>없는 주소입니다.</p>
            <Link to="/">홈으로</Link>
        </div>
    );
}
