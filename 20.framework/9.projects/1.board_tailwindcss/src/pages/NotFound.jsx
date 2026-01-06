import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div>
            <h1>Not Found</h1>
            <p className="text-muted">페이지를 찾을 수 없습니다.</p>
            <Link to="/posts">게시판으로</Link>
        </div>
    );
}
