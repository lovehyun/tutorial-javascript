// src/router.jsx
import { createBrowserRouter } from 'react-router-dom';

import RootLayout from './layouts/RootLayout.jsx';
import RouteError from './pages/RouteError.jsx';
import NotFound from './pages/NotFound.jsx';

import staticRoutes from './routes/static.routes.jsx';
import usersRoutes from './routes/users.routes.jsx';
import postsRoutes from './routes/posts.routes.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,

        // loader/action에서 throw된 에러(404 포함)는 여기서 처리
        // - RootLayout 아래(Outlet 자리)에 렌더링되므로 Navbar 유지
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
            ...staticRoutes,
            ...usersRoutes,
            ...postsRoutes,

            // URL 경로 자체가 없는 경우(진짜 404)
            { path: '*', element: <NotFound /> },
        ],
    },
]);

export default router;
