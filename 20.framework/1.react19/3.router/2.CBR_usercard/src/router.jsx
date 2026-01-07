import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './layouts/RootLayout.jsx';
import Users from './pages/Users.jsx';
import UserDetail from './pages/UserDetail.jsx';
import NotFound from './pages/NotFound.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <NotFound />,
        children: [
            { index: true, element: <Users /> }, // "/" => Users로
            { path: 'users', element: <Users /> }, // "/users"
            { path: 'users/:userId', element: <UserDetail /> }, // "/users/3"
        ],
    },
]);

export default router;
