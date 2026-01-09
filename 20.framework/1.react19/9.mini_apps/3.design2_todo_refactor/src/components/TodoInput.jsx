import { useState } from 'react';

export default function TodoInput({ onAdd }) {
    const [value, setValue] = useState('');

    const submit = () => {
        onAdd(value);
        setValue('');
    };

    return (
        <div className="input-group mb-3">
            <input
                className="form-control"
                placeholder="할 일을 입력하세요"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
            <button className="btn btn-primary" onClick={submit}>
                추가
            </button>
        </div>
    );
}
