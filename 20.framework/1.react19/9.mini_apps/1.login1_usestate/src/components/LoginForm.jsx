import TextInput from './TextInput.jsx';

export default function LoginForm({ form, onChange, onSubmit }) {
    return (
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10 }}>
            <TextInput label="아이디" name="id" value={form.id} onChange={onChange} />
            <TextInput label="비밀번호" name="pw" type="password" value={form.pw} onChange={onChange} />
            
            <button type="submit">로그인</button>
        </form>
    );
}
