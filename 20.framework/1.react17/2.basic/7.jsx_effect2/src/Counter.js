import React, { useEffect } from 'react';

const Counter = ({count, setCount }) => {

    const handleIncrement = () => setCount(count + 1);
    const handleDecrement = () => setCount(count - 1);

    // useEffect 사용
    useEffect(() => {
        console.log(`Count has changed: ${count}`);

        // Cleanup 함수 예시 (필요 시)
        return () => {
            console.log('Cleanup before next effect or unmount.');
        };
    }, [count]); // count 값이 변경될 때만 실행

    return (
        <div>
            <h2>Counter</h2>
            <button onClick={handleIncrement}>Increase</button>
            <button onClick={handleDecrement}>Decrease</button>
        </div>
    );
};

export default Counter;
