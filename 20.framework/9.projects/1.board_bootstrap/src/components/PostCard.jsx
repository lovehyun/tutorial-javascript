import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
    const preview = post.content.length > 80 ? post.content.slice(0, 80) + '...' : post.content;

    return (
        <div className="card h-100">
            <div className="card-body d-flex flex-column">
                <h5 className="card-title mb-2">
                    <Link to={`/posts/${post.id}`} className="text-decoration-none">
                        {post.title}
                    </Link>
                </h5>

                <div className="text-muted small mb-2">
                    {post.author} · {new Date(post.createdAt).toLocaleString()}
                </div>

                <p className="card-text text-muted">{preview}</p>

                <div className="mt-auto">
                    <Link to={`/posts/${post.id}`} className="btn btn-sm btn-outline-primary">
                        상세보기
                    </Link>
                </div>
            </div>
        </div>
    );
}
