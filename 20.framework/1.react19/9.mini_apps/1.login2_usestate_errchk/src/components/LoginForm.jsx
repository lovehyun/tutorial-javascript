import TextInput from './TextInput.jsx';

export default function LoginForm({ form, message, onChange, onSubmit }) {
    return (
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10 }}>
            <TextInput label="아이디" name="id" value={form.id} onChange={onChange} />
            <TextInput label="비밀번호" name="pw" type="password" value={form.pw} onChange={onChange} />

            <button type="submit">로그인</button>

            {/* 3) ✅ 메시지 표시 */}
            {message && <div style={{ padding: 10, border: '1px solid #ddd', borderRadius: 8 }}>{message}</div>}
        </form>
    );
}
