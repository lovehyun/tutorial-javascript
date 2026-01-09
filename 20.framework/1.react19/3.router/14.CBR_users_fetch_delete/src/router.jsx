// 1. "읽기(READ)"와 "쓰기(WRITE)"를 라우터가 표준화한다
//  - 조회(READ): loader
//    GET 성격, "페이지에 들어오면 데이터를 가져와라", 캐시/재검증/프리패치 같은 최적화 대상
//  - 변경(WRITE): action
//    POST(추가), PATCH/PUT(수정), DELETE(삭제) → 전부 action
//    "상태를 바꾸는 요청", 성공하면 보통 다른 페이지로 이동(redirect)하거나 같은 페이지 데이터를 다시 가져와야 함(revalidate)

// 2. submit 상태/리다이렉트/재로딩을 “일관된 규칙”으로 제공한다
// BR에서는 삭제할 때마다 매번 개발자가 직접 합니다:
//  - 삭제 중 disable
//  - 성공하면 어디로 이동?
//  - 목록 다시 불러와야 함?
//  - 에러면 어떻게 표시?
// CBR에서는 이게 규칙입니다.
//  - <Form method="post"> 제출 → 라우터가 action 실행
//  - 진행 상태: useNavigation().state === 'submitting'
//  - 성공: redirect('/users')
//  - 그 다음 필요한 loader는 자동으로 다시 실행(재검증)

import { createBrowserRouter, redirect } from 'react-router-dom';

import RootLayout from './layouts/RootLayout.jsx';
import Home from './pages/Home.jsx';
import Users from './pages/Users.jsx';
import UserDetail from './pages/UserDetail.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

import { fetchUsers, fetchUserById, deleteUserById } from './api/usersApi.js';

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <NotFound />,
        children: [
            { index: true, element: <Home /> },

            {
                path: 'users',
                element: <Users />,
                loader: ({ request }) => fetchUsers({ signal: request.signal }),
            },

            {
                path: 'users/:userId',
                element: <UserDetail />,
                loader: async ({ params, request }) => {
                    const user = await fetchUserById(params.userId, { signal: request.signal });

                    // (방어) 보통은 404면 usersApi에서 throw라 여기까지 안 옴
                    if (!user || !user.id) {
                        throw new Response('User Not Found', { status: 404 });
                    }

                    return user;
                },
            },

            // 삭제 전용 라우트 (화면 없음, action만)
            {
                path: 'users/:userId/delete',
                action: async ({ params }) => {
                    await deleteUserById(params.userId);

                    // 삭제 후 목록으로 이동
                    return redirect("/users");
                },
            },

            { path: 'about', element: <About /> },
            { path: '*', element: <NotFound /> },
        ],
    },
]);

export default router;
