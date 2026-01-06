import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
    const preview = post.body.length > 90 ? post.body.slice(0, 90) + '...' : post.body;

    return (
        <div className="card h-100">
            <div className="card-body d-flex flex-column">
                <h5 className="card-title mb-2">
                    <Link to={`/posts/${post.id}`} className="text-decoration-none">
                        {post.title}
                    </Link>
                </h5>

                <p className="card-text text-muted mb-3">{preview}</p>

                <div className="mt-auto d-flex justify-content-between">
                    <span className="badge text-bg-secondary">Post #{post.id}</span>

                    <Link to={`/posts/${post.id}`} className="btn btn-sm btn-outline-primary">
                        상세보기
                    </Link>
                </div>
            </div>
        </div>
    );
}
