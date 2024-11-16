import React, { useState } from 'react';

const Counter = () => {
    const [count, setCount] = useState(0); // State 선언

    const handleIncrement = () => setCount(count + 1);
    const handleDecrement = () => setCount(count - 1);

    return (
        <div>
            <h2>Counter: {count}</h2>
            <button onClick={handleIncrement}>Increase</button>
            <button onClick={handleDecrement}>Decrease</button>
        </div>
    );
};

export default Counter;
