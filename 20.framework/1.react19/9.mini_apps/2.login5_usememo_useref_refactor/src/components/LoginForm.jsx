import TextInput from './TextInput.jsx';

export default function LoginForm({
    form,
    loading,
    canSubmit,
    message, // { type, text }
    onChange,
    onSubmit,
    onReset,
    idRef,
    pwRef,
}) {
    const boxStyle = {
        padding: 10,
        borderRadius: 8,
        border: '1px solid #ddd',
    };

    const messageStyle =
        message.type === 'success'
            ? { ...boxStyle, borderColor: '#16a34a', background: '#dcfce7', color: '#14532d' }
            : message.type === 'error'
            ? { ...boxStyle, borderColor: '#dc2626', background: '#fee2e2', color: '#7f1d1d' }
            : boxStyle;

    return (
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
            <TextInput
                label="아이디"
                name="id"
                type="text"
                value={form.id}
                disabled={loading}
                placeholder="아이디를 입력하세요"
                onChange={onChange}
                inputRef={idRef}
                autoComplete="username"
            />

            <TextInput
                label="비밀번호"
                name="pw"
                type="password"
                value={form.pw}
                disabled={loading}
                placeholder="비밀번호를 입력하세요"
                onChange={onChange}
                inputRef={pwRef}
                autoComplete="current-password"
            />

            {/* ✅ 아이디 저장 체크박스 */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                    type="checkbox"
                    checked={form.rememberId}
                    disabled={loading}
                    onChange={(e) => onChange('rememberId', e.target.checked)}
                />
                아이디 저장
            </label>

            {/* ✅ 성공/실패 메시지 스타일 구분 + 접근성 role */}
            {message.text && (
                <div
                    role={message.type === 'error' ? 'alert' : 'status'}
                    style={messageStyle}
                >
                    {message.text}
                </div>
            )}

            <div style={{ display: 'flex', gap: 8 }}>
                {/* ✅ 빈 값이면 버튼 비활성화 + 로딩 중 중복 제출 방지 */}
                <button type="submit" disabled={!canSubmit} style={{ flex: 1 }}>
                    {loading ? '로그인 중...' : '로그인'}
                </button>

                <button type="button" onClick={onReset} disabled={loading}>
                    초기화
                </button>
            </div>
        </form>
    );
}
