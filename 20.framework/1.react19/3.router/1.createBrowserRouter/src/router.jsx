import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './layouts/RootLayout.jsx';
import Home from './pages/Home.jsx';
import Users from './pages/Users.jsx';
import UserDetail from './pages/UserDetail.jsx';
import NotFound from './pages/NotFound.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <NotFound />, // 라우트 매칭 실패/에러 시 보여줄 화면
        children: [
            { index: true, element: <Home /> }, // "/"
            { path: 'users', element: <Users /> }, // "/users"
            { path: 'users/:userId', element: <UserDetail /> }, // "/users/3"
        ],
    },
]);

export default router;
