import { useState } from 'react';
import LoginForm from '../components/LoginForm.jsx';

export default function LoginPage() {
    const [form, setForm] = useState({ id: '', pw: '' });

    // 손자가 호출하면 결국 여기로 올라옵니다
    // id/pw 이벤트가 따로 올라와서, 각각 이전값에 append 하도록...
    const updateField = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // submit도 그냥 alert로 끝 (가장 단순)
    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`id=${form.id}, pw=${form.pw}`);
    };

    return (
        <div style={{ maxWidth: 360, margin: '40px auto' }}>
            <h2>로그인</h2>

            <LoginForm form={form} onChange={updateField} onSubmit={handleSubmit} />
        </div>
    );
}


// 부모가 state를 가짐
// 부모의 업데이트 함수를 props로 내려줌
// 손자(TextInput)가 onChange(name, value)로 호출
// 값은 손자 → 부모로 "직접" 가는 게 아니라, 콜백 호출로 올라감

/*
export default function LoginPage() {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`id=${id}, pw=${pw}`);
    };

    return (
        <div style={{ maxWidth: 360, margin: '40px auto' }}>
            <h2>로그인</h2>
            <LoginForm
                id={id}
                pw={pw}
                onIdChange={(e) => setId(e.target.value)}
                onPwChange={(e) => setPw(e.target.value)}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
*/
