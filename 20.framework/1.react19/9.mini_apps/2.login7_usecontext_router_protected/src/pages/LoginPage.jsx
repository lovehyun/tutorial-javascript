import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm.jsx';
import { useLoginForm } from '../hooks/useLoginForm.js';
import { useAuth } from '../auth/AuthProvider.jsx';

export default function LoginPage() {
    const navigate = useNavigate();

    // ✅ AuthContext에서 login 함수를 가져옵니다.
    const { login, isAuthed } = useAuth();

    const { form, loading, message, canSubmit, updateField, submit, reset, idRef, pwRef } = useLoginForm();

    /**
     * 이미 로그인된 상태에서 로그인 페이지에 들어온 경우 처리(선택)
     * - 원하시면 바로 profile로 보내도 됩니다.
     * - 최소 변경 원칙에 맞춰서 "안내 + 버튼" 정도만 해도 됩니다.
     */
    // if (isAuthed) {
    //   navigate('/profile', { replace: true });
    // }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const user = await submit(); // ✅ 성공이면 user 반환 (훅에서 return user)
            // ✅ React 전역 로그인 상태 저장
            login(user);

            // ✅ 로그인 후 profile로 이동
            navigate('/profile');
        } catch {
            // 실패 메시지는 훅에서 처리
        }
    };

    return (
        <div style={{ maxWidth: 420, margin: '40px auto', padding: 16 }}>
            <h1 style={{ marginBottom: 8 }}>로그인</h1>
            <p style={{ marginTop: 0, opacity: 0.3 }}>
                테스트 계정: <b>admin / 1234</b>
            </p>

            <LoginForm
                form={form}
                loading={loading}
                canSubmit={canSubmit}
                message={message}
                onChange={updateField}
                onSubmit={handleSubmit}
                onReset={reset}
                idRef={idRef}
                pwRef={pwRef}
            />
        </div>
    );
}
