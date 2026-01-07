import { useEffect, useMemo, useRef, useState } from 'react';
import { fakeLoginApi } from '../api/auth';
import { clearSavedId, getSavedId, setSavedId } from '../utils/savedIdStorage';

export function useLoginForm() {
    const [form, setForm] = useState({ id: '', pw: '', rememberId: false });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const idRef = useRef(null);
    const pwRef = useRef(null);

    // 초기 로드: 저장된 아이디 + 포커스
    useEffect(() => {
        const savedId = getSavedId();
        if (savedId) setForm((p) => ({ ...p, id: savedId, rememberId: true }));
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

            if (name === 'rememberId') {
                if (value) {
                    const id = prev.id.trim();
                    if (id) setSavedId(id);
                } else {
                    clearSavedId();
                }
            }

            if (name === 'id' && prev.rememberId) {
                const id = String(value).trim();
                if (id) setSavedId(id);
                else clearSavedId();
            }

            return next;
        });
    };

    const submit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        const id = form.id.trim();
        const pw = form.pw.trim();

        if (!id || !pw) {
            setMessage({ type: 'error', text: '아이디와 비밀번호를 모두 입력해 주세요.' });
            if (!id) idRef.current?.focus();
            else pwRef.current?.focus();
            return;
        }

        if (!canSubmit) return;

        setLoading(true);
        try {
            const res = await fakeLoginApi({ id, pw });
            setMessage({ type: 'success', text: `✅ 로그인 성공! (${res.user.id})` });
            setForm((p) => ({ ...p, pw: '' }));
            pwRef.current?.focus();
        } catch (err) {
            setMessage({ type: 'error', text: `❌ 로그인 실패: ${err.message || '오류가 발생했습니다.'}` });
            setForm((p) => ({ ...p, pw: '' }));
            pwRef.current?.focus();
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
