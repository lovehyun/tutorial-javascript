import { useEffect, useMemo, useRef, useState } from 'react';
import { fakeLoginApi } from '../api/auth';
import { clearSavedId, getSavedId, setSavedId } from '../utils/savedIdStorage';

export function useLoginForm() {
    const [form, setForm] = useState({ id: '', pw: '', rememberId: false });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const idRef = useRef(null);
    const pwRef = useRef(null);
    const pendingFocus = useRef(null); // 'id' | 'pw' | null

    // 초기 로드: 저장된 아이디 + 포커스
    useEffect(() => {
        const savedId = getSavedId();
        if (savedId) setForm((prev) => ({ ...prev, id: savedId, rememberId: true }));
        idRef.current?.focus();
    }, []);

    // 성공 메시지 자동 제거
    useEffect(() => {
        if (message.type !== 'success') return;
        const t = setTimeout(() => setMessage({ type: '', text: '' }), 2000);
        return () => clearTimeout(t);
    }, [message.type]);

    const canSubmit = useMemo(() => {
        return !loading && form.id.trim() && form.pw.trim();
    }, [loading, form.id, form.pw]);

    const updateField = (name, value) => {
        setForm((prev) => {
            const next = { ...prev, [name]: value };

            // rememberId 토글 시 저장/삭제
            if (name === 'rememberId') {
                if (value) {
                    const id = prev.id.trim();
                    if (id) setSavedId(id);
                } else {
                    clearSavedId();
                }
            }

            // 아이디 입력 중 & rememberId가 켜져 있으면 실시간 저장
            if (name === 'id' && prev.rememberId) {
                const id = String(value).trim();
                if (id) setSavedId(id);
                else clearSavedId();
            }

            return next;
        });
    };

    // 포커스 처리를 예약해준것 랜더링 이후에 처리
    useEffect(() => {
        if (loading) return;
        if (pendingFocus.current === 'pw') {
            pwRef.current?.focus();
        } else if (pendingFocus.current === 'id') {
            idRef.current?.focus();
        }
        pendingFocus.current = null;
    }, [loading]);


    // ✅ 이 함수는 "성공이면 resolve, 실패면 throw" 해야
    // LoginPage에서 성공 시 navigate가 가능합니다.
    const submit = async () => {
        if (!canSubmit) return;
        setMessage({ type: '', text: '' });
        setLoading(true);

        const id = form.id.trim();
        const pw = form.pw.trim();

        try {
            const {ok, user} = await fakeLoginApi({ id, pw });
            if (!ok) throw new Error('로그인에 실패했습니다.');

            setMessage({ type: 'success', text: `✅ 로그인 성공! (${user.id})` });
            setForm((prev) => ({ ...prev, pw: '' }));
            return user; // ✅ 성공 반환
        } catch (err) {
            setMessage({ type: 'error', text: `❌ 로그인 실패: ${err.message || '오류가 발생했습니다.'}` });
            setForm((prev) => ({ ...prev, pw: '' }));
            
            // pwRef.current?.focus();
            pendingFocus.current = 'pw';   // ✅ 지금 말고, 로딩 끝난 다음에 포커스 (pw 입력필드가 setLoading(true) 상태라 focus 불가함)
            throw err; // ✅ 실패 throw
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setForm((p) => ({ ...p, pw: '' })); // 정책: id/rememberId는 유지
        setMessage({ type: '', text: '' });
        if (form.id.trim()) pwRef.current?.focus();
        else idRef.current?.focus();
    };

    return {
        form,
        loading,
        message,
        canSubmit,
        updateField,
        submit,
        reset,
        idRef,
        pwRef,
        setMessage, // 필요하면 외부에서 메시지 제어 가능
    };
}
