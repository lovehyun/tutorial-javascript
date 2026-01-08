import { useState, useEffect } from 'react';

export default function App() {
    const [count, setCount] = useState(0);

    const handleIncrease = () => {
        console.log('함수시작: ', count); // 0
        setCount(count + 1);
        console.log('함수끝: ', count); // 0 여기에서도 안바뀜 (setCount의 지연처리)
    };

    // useEffect(() => {
    //     console.log('count 변경됨:', count);
    // }, [count]);
    
    // const handleReset = () => {
    //     setCount(0);
    // };

    return (
        <>
            <h1>{count}</h1>
            
            <button onClick={handleIncrease}>+1</button>

            {/* <button onClick={() => setCount(count + 1)}>+1</button> */}
            
            <button onClick={() => setCount(0)}>reset</button>
        </>
    );
}
