import { Link } from 'react-router-dom';

const mockUsers = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
];

export default function Users() {
    return (
        <>
            <h1>Users</h1>
            <ul>
                {mockUsers.map((u) => (
                    <li key={u.id}>
                        <Link to={`/users/${u.id}`}>{u.name}</Link>
                    </li>
                ))}
            </ul>
        </>
    );
}
