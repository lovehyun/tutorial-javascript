import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
    const preview = post.content.length > 90 ? post.content.slice(0, 90) + '...' : post.content;

    return (
        <div className="h-full rounded-xl border bg-white shadow-sm hover:shadow transition">
            <div className="p-4 flex flex-col h-full">
                <h3 className="text-base font-semibold leading-snug line-clamp-2">
                    <Link to={`/posts/${post.id}`} className="hover:underline underline-offset-2">
                        {post.title}
                    </Link>
                </h3>

                <div className="mt-1 text-xs text-slate-500">
                    {post.author} · {new Date(post.createdAt).toLocaleString()}
                </div>

                <p className="mt-3 text-sm text-slate-600 whitespace-pre-wrap line-clamp-3">{preview}</p>

                <div className="mt-auto pt-4">
                    <Link
                        to={`/posts/${post.id}`}
                        className="inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
                    >
                        상세보기
                    </Link>
                </div>
            </div>
        </div>
    );
}
