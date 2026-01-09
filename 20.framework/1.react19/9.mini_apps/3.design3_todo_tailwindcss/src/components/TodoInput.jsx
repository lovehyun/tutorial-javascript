import { useState } from 'react';

export default function TodoInput({ onAdd }) {
    const [value, setValue] = useState('');

    const submit = () => {
        onAdd(value);
        setValue('');
    };

    return (
        <div className="inputRow">
            <input
                className="input"
                value={value}
                placeholder="할 일을 입력하세요"
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
            <button className="btn-primary" onClick={submit}>
                추가
            </button>
        </div>
    );
}
