import AuthRequiredPage from '../pages/AuthRequiredPage.jsx';
import { useAuth } from './AuthProvider.jsx';

/**
 * ProtectedRoute:
 * - 로그인 상태면 children(보호할 페이지)을 그대로 보여줌
 * - 로그아웃 상태면 "로그인이 필요합니다" 안내 페이지를 보여줌
 *
 * 요구사항: "미로그인 접근 시 로그인 페이지로 강제 이동"이 아니라
 *           "안내 페이지를 보여주기" => Navigate로 redirect 하지 않습니다.
 */
export default function ProtectedRoute({ children }) {
    const { isAuthed } = useAuth();

    if (!isAuthed) {
        return <AuthRequiredPage />;
    }

    return children;
}
