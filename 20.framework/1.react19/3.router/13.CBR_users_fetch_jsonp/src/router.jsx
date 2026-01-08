// BR(구버전)에서는:
//  - 페이지 컴포넌트가 마운트됨
//  - useEffect로 fetch
//  - loading/error/data 상태를 페이지마다 들고 있음
// CBR(Data Router)에서는:
//  - URL 매칭 → 라우트의 loader가 먼저 실행
//  - loader 결과가 준비된 다음 컴포넌트가 렌더
//  - 컴포넌트는 보통 useLoaderData()로 데이터를 받기만 함
//
// "한 곳(router.jsx 한 파일)에서 모든 데이터를 해결"이라기보다,
// 각 라우트가 자기 데이터 로딩(loader)을 가진다(라우트 단위 책임 분리).

import { createBrowserRouter } from 'react-router-dom';

import RootLayout from './layouts/RootLayout.jsx';

import Home from './pages/Home.jsx';
import Users from './pages/Users.jsx';
import UserDetail from './pages/UserDetail.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

import { fetchUsers, fetchUserById } from './api/usersApi.js';

// 그리고 /users/99 에서 loader가 throw 하거나 fetch가 에러로 떨어지면,
// 그건 "자식 element(UserDetail)"이 아니라 라우트 에러가 됩니다.
// 그래서 errorElement 가 catch 해서 NotFound 로 이동됨.
// https://reactrouter.com/6.30.2/route/error-element

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
                loader: async ({ request }) => {
                    // CBR은 AbortController를 직접 만들지 않고 request.signal을 넘김
                    return fetchUsers({ signal: request.signal });
                },
            },

            // "/users/:userId" (상세: id/name/email)
            {
                path: 'users/:userId',
                element: <UserDetail />,
                loader: async ({ params, request }) => {
                    // 공통 usersApi 그대로 사용
                    const user = await fetchUserById(params.userId, { signal: request.signal });

                    // (선택) json이 비정상일 때 방어하고 싶으면 여기서 처리
                    // 그런데 현재 usersApi는 404면 throw로 떨어지므로 보통 여기까지 못 옵니다.
                    if (!user || !user.id) {
                        throw new Response('User Not Found', { status: 404 });
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
