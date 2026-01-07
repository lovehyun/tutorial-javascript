// 빈 값이면 submit 막기
// 실패/성공 후 password만 reset
// 성공/실패 메시지 표시

import { useState } from 'react';
import LoginForm from '../components/LoginForm.jsx';

export default function LoginPage() {
    const [form, setForm] = useState({ id: '', pw: '' });
    const [message, setMessage] = useState(''); // ✅ 성공/실패 메시지

    const updateField = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');

        const id = form.id.trim();
        const pw = form.pw.trim();

        // 1) ✅ 빈 값이면 막기
        if (!id || !pw) {
            setMessage('아이디와 비밀번호를 모두 입력해 주세요.');
            return;
        }

        // (가짜 로그인 판정)
        const ok = id === 'admin' && pw === '1234';

        if (ok) {
            setMessage('✅ 로그인 성공!');
            // 2) ✅ 성공 후에도 password만 지우기
            setForm((prev) => ({ ...prev, pw: '' }));
        } else {
            setMessage('❌ 로그인 실패: 아이디 또는 비밀번호가 틀렸습니다.');
            // 2) ✅ 실패 후 password만 지우기
            setForm((prev) => ({ ...prev, pw: '' }));
        }
    };

    return (
        <div style={{ maxWidth: 360, margin: '40px auto' }}>
            <h2>로그인</h2>
            <p style={{ opacity: 0.7, marginTop: 0 }}>
                테스트: <b>admin / 1234</b>
            </p>

            <LoginForm form={form} message={message} onChange={updateField} onSubmit={handleSubmit} />
        </div>
    );
}
