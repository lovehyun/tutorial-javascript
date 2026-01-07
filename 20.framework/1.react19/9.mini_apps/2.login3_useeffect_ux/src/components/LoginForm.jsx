import TextInput from './TextInput.jsx';

export default function LoginForm({ form, message, canSubmit, onChange, onSubmit }) {
    const boxStyle = {
        padding: 10,
        borderRadius: 8,
        border: '1px solid #ddd',
    };

    const messageStyle =
        message.type === 'success'
            ? { ...boxStyle, borderColor: '#16a34a', background: '#dcfce7' }
            : message.type === 'error'
            ? { ...boxStyle, borderColor: '#dc2626', background: '#fee2e2' }
            : boxStyle;

    return (
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10 }}>
            <TextInput label="아이디" name="id" value={form.id} onChange={onChange} autoFocus />

            <TextInput label="비밀번호" name="pw" type="password" value={form.pw} onChange={onChange} />

            {/* ✅ 아이디 저장 체크박스 */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                    type="checkbox"
                    checked={form.rememberId}
                    onChange={(e) => onChange('rememberId', e.target.checked)}
                />
                아이디 저장
            </label>

            {/* ✅ 빈 값이면 버튼 비활성화 */}
            <button type="submit" disabled={!canSubmit}>
                로그인
            </button>

            {/* ✅ 성공/실패 메시지 스타일 구분 */}
            {message.text && <div style={messageStyle}>{message.text}</div>}
        </form>
    );
}
