import React, { useState } from 'react';

// function Counter() { };
const Counter = () => {
    // 초기 state와 변경 함수 설정
    const [count, setCount] = useState(0); // State 선언

    const handleIncrement = () => setCount(count + 1);
    const handleDecrement = () => setCount(count - 1);

    return (
        <div>
            <h2>Counter: {count}</h2>
            
            {/* <button onClick={() => setCount(count + 1)}>Increment</button> */}
            {/* <button onClick={() => setCount(count - 1)}>Dencrement</button> */}

            <button onClick={handleIncrement}>Increase</button>
            <button onClick={handleDecrement}>Decrease</button>
        </div>
    );
};

export default Counter;
