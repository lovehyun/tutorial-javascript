import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './layouts/RootLayout.jsx';
import Users from './pages/Users.jsx';
import UserDetail from './pages/UserDetail.jsx';
import Posts from './pages/Posts.jsx';
import PostDetail from './pages/PostDetail.jsx';
import NotFound from './pages/NotFound.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <NotFound />,
        children: [
            { index: true, element: <Users /> },

            { path: 'users', element: <Users /> },
            { path: 'users/:userId', element: <UserDetail /> },

            { path: 'posts', element: <Posts /> },
            { path: 'posts/:postId', element: <PostDetail /> },
        ],
    },
]);

export default router;
