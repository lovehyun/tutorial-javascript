import { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * AuthContext: 앱 전체에서 로그인 상태(user)와
 * 로그인/로그아웃 함수를 공유하기 위한 Context입니다.
 */
const AuthContext = createContext(null);

/**
 * 학습용: 새로고침 후에도 로그인 상태를 유지하고 싶으면 Storage 사용
 * - 탭을 닫으면 풀리게 하고 싶으면 sessionStorage
 * - 계속 유지하고 싶으면 localStorage
 *
 * 여기서는 "학습용"이므로 sessionStorage를 기본으로 사용하겠습니다.
 * (보안 측면에서 sessionStorage/localStorage는 XSS에 취약하므로
 * 실서비스에서는 HttpOnly 쿠키 + 서버 세션 방식이 정석입니다.)
 */
const STORAGE_KEY = 'auth_user';
const storage = sessionStorage; // 필요 시 localStorage로 변경 가능

export function AuthProvider({ children }) {
    // user: { id: 'admin', ... } 형태를 가정
    const [user, setUser] = useState(null);

    // 앱 최초 로드 시 저장된 로그인 상태 복원
    useEffect(() => {
        const raw = storage.getItem(STORAGE_KEY);
        if (!raw) return;

        try {
            const parsed = JSON.parse(raw);
            setUser(parsed);
        } catch {
            // 저장된 값이 깨졌으면 삭제
            storage.removeItem(STORAGE_KEY);
        }
    }, []);

    /**
     * login: 로그인 성공 시 user를 저장하고 전역 상태에 반영
     * - 최소 정보만 저장하는 것이 좋습니다. (학습용으로는 id 정도면 충분)
     */
    const login = (nextUser) => {
        setUser(nextUser);
        storage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    };

    /**
     * logout: 로그아웃 처리
     */
    const logout = () => {
        setUser(null);
        storage.removeItem(STORAGE_KEY);
    };

    const value = useMemo(() => {
        return {
            user,
            isAuthed: !!user, // 로그인 여부
            login,
            logout,
        };
    }, [user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth: Context를 쉽게 쓰기 위한 커스텀 훅
 * - AuthProvider 밖에서 호출되면 오류를 던져서 실수를 빨리 발견하게 합니다.
 */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth는 <AuthProvider> 내부에서만 사용할 수 있습니다.');
    }
    return ctx;
}
