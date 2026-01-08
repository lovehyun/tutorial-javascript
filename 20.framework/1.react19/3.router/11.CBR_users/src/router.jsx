import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './layouts/RootLayout.jsx';
import Home from './pages/Home.jsx';
import Users from './pages/Users.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

/**
 * Data Router (v6.4+)
 * - 아직 loader/action 사용 안 함
 * - "URL → 화면" 매핑만 담당
 */
const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <NotFound />, // 라우트 에러용 (지금은 거의 안 씀)
        children: [
            { index: true, element: <Home /> }, // "/"
            { path: 'users', element: <Users /> }, // "/users"
            { path: 'about', element: <About /> }, // "/about"
            { path: '*', element: <NotFound /> }, // 404
        ],
    },
]);

export default router;
