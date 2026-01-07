import { useState } from 'react';

function Child({ onSubmit }) {
    const [text, setText] = useState('');

    return (
        <div>
            <input value={text} onChange={(e) => setText(e.target.value)} />
            <button onClick={() => onSubmit(text)}>전달</button>
        </div>
    );
}

export default Child;
