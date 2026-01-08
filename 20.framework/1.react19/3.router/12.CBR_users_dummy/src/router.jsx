import { createBrowserRouter } from 'react-router-dom';

import RootLayout from './layouts/RootLayout.jsx';

import Home from './pages/Home.jsx';
import Users from './pages/Users.jsx';
import UserDetail from './pages/UserDetail.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

import { fetchUsers, fetchUserById } from './api/fakeUsersApi.js';

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        // loader에서 throw된 에러(예: 404 Response)도 여기서 받을 수 있음
        errorElement: <NotFound />,
        children: [
            // "/" (Home)
            { index: true, element: <Home /> },

            // "/users" (목록: 이름만)
            {
                path: 'users',
                element: <Users />,
                loader: async () => {
                    return fetchUsers();
                },
            },

            // "/users/:userId" (상세: id/name/email)
            {
                path: 'users/:userId',
                element: <UserDetail />,
                loader: async ({ params }) => {
                    const user = await fetchUserById(params.userId);

                    // 없으면 라우트 에러로 처리 (errorElement로 이동)
                    if (!user) {
                        throw new Response('Not Found', { status: 404 });
                    }

                    return user;
                },
            },

            // "/about"
            { path: 'about', element: <About /> },

            // 나머지 전부 404
            { path: '*', element: <NotFound /> },
        ],
    },
]);

export default router;
