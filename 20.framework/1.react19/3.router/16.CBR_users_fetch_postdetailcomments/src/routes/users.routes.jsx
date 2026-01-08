// src/routes/users.routes.js
import Users from '../pages/Users.jsx';
import UserDetail from '../pages/UserDetail.jsx';

import { usersLoader, userDetailLoader, deleteUserAction } from '../handlers/users.handlers.js';

export default [
    {
        path: 'users',
        element: <Users />,
        loader: usersLoader,
    },
    {
        path: 'users/:userId',
        element: <UserDetail />,
        loader: userDetailLoader,
    },
    {
        // 화면 없음(action 전용)
        path: 'users/:userId/delete',
        action: deleteUserAction,
    },
];
