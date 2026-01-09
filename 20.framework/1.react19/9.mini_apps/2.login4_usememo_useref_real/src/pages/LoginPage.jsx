// 아이디 저장: 체크/해제 "즉시" localStorage 반영 (새로고침 시 체크가 되돌아오는 문제 해결)
// 비동기 로그인 + 로딩: 실제 서버 호출처럼 동작(중복 클릭 방지)
// 입력 잠금: 로딩 중 input/checkbox 비활성화
// 메시지: success/error 스타일 분리 + role로 접근성 개선
// Enter 제출: <form onSubmit> 구조라 자동 지원
// 자동 포커스/포커스 이동: 진입 시 id 포커스, 실패 시 pw 포커스

// useRef는 "렌더링과 상관없이 값을 보관하거나, DOM에 직접 접근하기 위한 도구"입니다.
// 이 예제에서 useRef의 목적은 "렌더링과 무관한 DOM 조작(포커스 이동)을 명확하고 안전하게 수행하기 위함" 입니다.

// useMemo는 "렌더링 중 계산 결과를 캐싱하는 도구" 이고,
// 이 예제에서 useMemo는 "canSubmit이 state가 아니라 파생값(derived value)임을 명확히 표현하기 위한 목적" 입니다.
// 성능 향상의 목적보다는 의미적 목적(semantic clarity) 이 더 큽니다

import { useState, useEffect, useMemo, useRef } from 'react';

import LoginForm from '../components/LoginForm.jsx';

const SAVED_ID_KEY = 'saved_login_id';

// 백엔드 없이 시뮬레이션 (admin / 1234 만 성공)
function fakeLoginApi({ id, pw }) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id === 'admin' && pw === '1234') resolve({ ok: true, user: { id } });
            else reject(new Error('아이디 또는 비밀번호가 올바르지 않습니다.'));
        }, 1000); // 1초 지연
    });
}

export default function LoginPage() {
    const [form, setForm] = useState({ id: '', pw: '', rememberId: false });

    // UI 상태
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' }); // "success" | "error" | ""

    // 자동 포커스 / 실패 시 포커스 이동용
    const idRef = useRef(null);
    const pwRef = useRef(null);

    // ✅ 시작 시 저장된 아이디가 있으면 불러오기 (+ 자동 포커스)
    useEffect(() => {
        const savedId = localStorage.getItem(SAVED_ID_KEY) || '';
        if (savedId) {
            setForm((prev) => ({ ...prev, id: savedId, rememberId: true }));
        }
        // 페이지 진입 시 아이디 입력창에 포커스
        idRef.current?.focus();
    }, []);

    // ✅ (추가기능) 로그인 성공 메시지 2초 후 자동 제거
    useEffect(() => {
        if (message.type !== 'success') return;

        const timer = setTimeout(() => {
            setMessage({ type: '', text: '' });
        }, 2000); // 2초

        // cleanup: 메시지가 바뀌거나 컴포넌트 언마운트 시 타이머 제거
        return () => clearTimeout(timer);
    }, [message.type]);

    // ✅ 파생값(derived): 제출(submit) 가능 여부
    const canSubmit = useMemo(() => {
        return !loading && form.id.trim() !== '' && form.pw.trim() !== '';
    }, [loading, form.id, form.pw]);
    
    // useMemo 없이 그냥 아래처럼 써도 무방함.
    // const canSubmit = !loading && form.id.trim() !== '' && form.pw.trim() !== '';

    // ✅ field 업데이트 + 아이디 저장 정책을 "즉시 반영" (체크박스 토글 순간)
    const updateField = (name, value) => {
        setForm((prev) => {
            const next = { ...prev, [name]: value };

            // 1) 체크박스 토글 순간에 localStorage 반영
            if (name === 'rememberId') {
                if (value) {
                    // 체크 ON이면 현재 id가 있으면 저장
                    const id = prev.id.trim();
                    if (id) localStorage.setItem(SAVED_ID_KEY, id);
                } else {
                    // 체크 OFF이면 즉시 삭제
                    localStorage.removeItem(SAVED_ID_KEY);
                }
            }

            // 2) 체크된 상태에서 id가 바뀌면 저장값도 같이 갱신
            if (name === 'id' && prev.rememberId) {
                const id = String(value).trim();
                if (id) localStorage.setItem(SAVED_ID_KEY, id);
                else localStorage.removeItem(SAVED_ID_KEY);
            }

            return next;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 메시지 초기화
        setMessage({ type: '', text: '' });

        const id = form.id.trim();
        const pw = form.pw.trim();

        // 빈 값 방어 (버튼 disabled여도 한 번 더)
        if (!id || !pw) {
            setMessage({ type: 'error', text: '아이디와 비밀번호를 모두 입력해 주세요.' });
            // 빈 값이면 보통 id에 포커스
            if (!id) idRef.current?.focus();
            else pwRef.current?.focus();
            return;
        }

        // 중복 제출 방지
        if (!canSubmit) return;

        setLoading(true);

        try {
            const res = await fakeLoginApi({ id, pw });

            setMessage({ type: 'success', text: `✅ 로그인 성공! (${res.user.id})` });

            // 성공 후 pw만 초기화 + 비밀번호 칸 포커스(원하시면 idRef로 바꿀 수 있습니다)
            setForm((prev) => ({ ...prev, pw: '' }));
            pwRef.current?.focus();
        } catch (err) {
            setMessage({ type: 'error', text: `❌ 로그인 실패: ${err.message || '오류가 발생했습니다.'}` });

            // 실패 후 pw만 초기화 + 비밀번호 재입력 포커스
            setForm((prev) => ({ ...prev, pw: '' }));
            pwRef.current?.focus();

            // (퀴즈) 버그. 위에꺼로 focus 안됨. (아직 setLoading 상태라 disabled 되어 있는 상태에서 focus 적용하는지라 실패함.)

            /* 해결책.
            setLoading(false); // 먼저 풀어줌
            requestAnimationFrame(() => { // 렌더 반영 후
                pwRef.current?.focus();
            });
            return; // finally에서 또 setLoading(false) 안 하게
            */
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setForm((prev) => ({
            id: prev.rememberId ? prev.id : '', // 체크되어 있으면 id는 유지(정책 선택)
            pw: '',
            rememberId: prev.rememberId,
        }));
        setMessage({ type: '', text: '' });

        // 리셋 후 포커스
        if (form.id.trim()) pwRef.current?.focus();
        else idRef.current?.focus();
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
                onReset={handleReset}
                idRef={idRef}
                pwRef={pwRef}
            />
        </div>
    );
}
