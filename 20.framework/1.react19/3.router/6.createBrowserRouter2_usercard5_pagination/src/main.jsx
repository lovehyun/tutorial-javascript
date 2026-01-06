// npm i @tanstack/react-query
// 이제부터 Posts/Detail/Comments는 전부 useQuery로 "데이터 + 로딩 + 에러"를 관리합니다.

// useEffect 제거 → 경고/레이스/상태 꼬임이 크게 줄어듭니다.
// queryKey만 잘 설계하면
// ["posts"]
// ["post", postId]
// ["post", postId, "comments"]
// 캐시 구조가 깔끔해집니다.
// Detail 갔다가 뒤로 가도 Posts가 즉시 뜹니다(캐시).

import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import router from './router.jsx';

// React Query 클라이언트(앱 전체 캐시/설정)
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // 기본값(입문용 추천)
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 30, // 30초 동안은 "신선"하다고 보고 재요청을 줄임
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
    </QueryClientProvider>
);
