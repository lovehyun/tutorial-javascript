// 로그인 버튼을 빈 값일 때 disabled
// 실패 메시지/성공 메시지 스타일을 다르게
// 아이디 저장 체크박스, 자동 포커스(autofocus)

import { useEffect, useState } from 'react';
import LoginForm from '../components/LoginForm.jsx';

const SAVED_ID_KEY = 'saved_login_id';

export default function LoginPage() {
    const [form, setForm] = useState({ id: '', pw: '', rememberId: false });
    const [message, setMessage] = useState({ type: '', text: '' }); // type: "success" | "error" | ""

    // ✅ 시작 시 저장된 아이디가 있으면 불러오기
    useEffect(() => {
        const savedId = localStorage.getItem(SAVED_ID_KEY) || '';
        if (savedId) {
            setForm((prev) => ({ ...prev, id: savedId, rememberId: true }));
        }
    }, []);

    const updateField = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // (버그) 체크박스 해지 후 리프래쉬 시 체크박스 다시 설정되어 있는 문제 해결
    /*
    const updateField = (name, value) => {
        setForm((prev) => {
            const next = { ...prev, [name]: value };

            if (name === 'rememberId') {
                if (!value) {
                    localStorage.removeItem(SAVED_ID_KEY);
                } else if (prev.id.trim()) {
                    localStorage.setItem(SAVED_ID_KEY, prev.id.trim());
                }
            }

            return next;
        });
    };
    */

    // ✅ 제출 가능 여부 (useMemo 없이 단순 변수)
    const canSubmit = form.id.trim() !== '' && form.pw.trim() !== '';

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        const id = form.id.trim();
        const pw = form.pw.trim();

        // 빈 값이면 막기 (버튼도 disabled지만, 방어적으로 한 번 더)
        if (!id || !pw) {
            setMessage({ type: 'error', text: '아이디와 비밀번호를 모두 입력해 주세요.' });
            return;
        }

        // 가짜 로그인 판정
        const ok = id === 'admin' && pw === '1234';

        // 아이디 저장 처리 - 위 버그해결 코드 활성화 시 여기 삭제
        if (form.rememberId) localStorage.setItem(SAVED_ID_KEY, id);
        else localStorage.removeItem(SAVED_ID_KEY);

        if (ok) {
            setMessage({ type: 'success', text: '✅ 로그인 성공!' });
            // 성공 후 pw만 초기화
            setForm((prev) => ({ ...prev, pw: '' }));
        } else {
            setMessage({ type: 'error', text: '❌ 로그인 실패: 아이디 또는 비밀번호가 틀렸습니다.' });
            // 실패 후 pw만 초기화
            setForm((prev) => ({ ...prev, pw: '' }));
        }
    };

    return (
        <div style={{ maxWidth: 380, margin: '40px auto' }}>
            <h2>로그인</h2>
            <p style={{ opacity: 0.3, marginTop: 0 }}>
                테스트: <b>admin / 1234</b>
            </p>

            <LoginForm
                form={form}
                message={message}
                canSubmit={canSubmit}
                onChange={updateField}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
