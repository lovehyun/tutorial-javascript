import { useEffect, useState } from 'react';

export default function App() {
    const [count, setCount] = useState(0);

    // useEffect(() => {
    //     // 부수 효과(side effect)
    // }, [의존성]);

    useEffect(() => {
        console.log('count 변경:', count);
    }, [count]);

    return (
        <>
            <p>{count}</p>
            <button onClick={() => setCount(count + 1)}>+1</button>
        </>
    );
}
