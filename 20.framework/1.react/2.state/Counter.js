// import React, { useState } from 'react'; 
import { useState } from 'react'; // React 17 이후부터는 React 불필요

const Counter = () => {
    console.log('Counter 호출');
    
    const [count, setCount] = useState(0); // 초기값 0
    
    const onIncrease = () => {
        setCount(count + 1);
    }

    const onDecrease = () => {
        setCount(count - 1);
    }

    return (
        <div>
            {/* <h2>0</h2> */}
            {/* <button>+</button> */}
            {/* <button>-</button> */}
            <h2>{count}</h2>
            <button onClick={onIncrease}>+</button>
            <button onClick={onDecrease}>-</button>
        </div>
    )
}

export default Counter;
