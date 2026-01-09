import { createBrowserRouter, redirect } from 'react-router-dom';

import RootLayout from './layouts/RootLayout.jsx';
import Home from './pages/Home.jsx';
import Users from './pages/Users.jsx';
import UserDetail from './pages/UserDetail.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

// (6단계 추가) 에러 시에도 Navbar 유지
import RouteError from './pages/RouteError.jsx';

// (5단계 추가 / 6단계 추가)
import Posts from './pages/Posts.jsx';
import PostDetail from './pages/PostDetail.jsx';

import {
    fetchUsers,
    fetchUserById,
    deleteUserById,
    fetchPosts,
    fetchPostById,
    fetchCommentsByPostId,
} from './api/usersApi.js';

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        
        // loader/action에서 throw되는 에러(404 포함)를 여기서 처리
        // - Navbar가 있는 에러 화면을 보여주기 위해 NotFound 대신 RouteError 사용
        errorElement: <RouteError />,

        // 초기 하이드레이션 동안 보여줄 대체 UI(hydrateFallback)을 지정.
        // SSR(서버 렌더링) 을 하면 서버가 HTML을 먼저 내려주고, 브라우저에서 ReactJS가 붙으면서 (이벤트 핸들러 등)
        // HTML에 인터렉션을 연결 하는 과정이 hydration 입니다.
        // 그런데 React Router의 parial hydration은 "한 번에 전부 연결" 이 아니라,
        // 라우트 모듈을 lazy로 쪼개거나
        // loader 데이터를 부분적으로만 준비한 상태에서
        // 일단 화면을 그려놓고, 필요한 부분만 순차적으로 연결/로드 하는 전략입니다.
        // 이때 "초기 하이드레이션 단계"에서 잠깐이라도 화면이 비는 구간이 생길 수 있으니,
        // 그 동안 보여줄 임시 UI가 바로 HydrateFallback입니다.
        hydrateFallbackElement: <p>초기 로딩 중...</p>,
        
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

            // 5단계
            { 
                path: 'posts', 
                element: <Posts />,
                loader: ({ request }) => fetchPosts({ signal: request.signal }),
            },

            // 6단계: Posts 상세 + comments
            {
                path: 'posts/:postId',
                element: <PostDetail />,
                loader: async ({ params, request }) => {
                    const { postId } = params;

                    // 상세 + 댓글 병렬 로딩
                    const [post, comments] = await Promise.all([
                        fetchPostById(postId, { signal: request.signal }),
                        fetchCommentsByPostId(postId, { signal: request.signal }),
                    ]);

                    // JSONPlaceholder 특성 방어(없는 id인데 {}가 올 때)
                    if (!post || !post.id) {
                        throw new Response('Post Not Found', { status: 404 });
                    }

                    return { post, comments: Array.isArray(comments) ? comments : [] };
                },
            },

            { path: 'about', element: <About /> },
            { path: '*', element: <NotFound /> },
        ],
    },
]);

export default router;
