import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm.jsx';
import { useLoginForm } from '../hooks/useLoginForm';

export default function LoginPage() {
    const navigate = useNavigate();
    const { 
        form, loading, message, canSubmit, 
        updateField, submit, reset, 
        idRef, pwRef 
    } = useLoginForm();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await submit();
            // 로그인 성공 시 이동
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
