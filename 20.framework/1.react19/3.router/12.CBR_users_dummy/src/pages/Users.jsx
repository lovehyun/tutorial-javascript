import { Link, useLoaderData } from 'react-router-dom';

export default function Users() {
    const users = useLoaderData(); // loader 반환값

    return (
        <div>
            <h1>Users</h1>
            <p>목록: 이름만 표시</p>

            <ul>
                {users.map((u) => (
                    <li key={u.id}>
                        <Link to={`/users/${u.id}`}>{u.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
