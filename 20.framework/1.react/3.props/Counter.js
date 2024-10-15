import { useState } from 'react';
import CounterResult from './CounterResult';

const Counter = (props) => {
    console.log('Counter 호출, props:', props);
    
    const [count, setCount] = useState(props.initialNum); // 부모 컴포넌트로부터 전달받음
    
    const onIncrease = () => {
        setCount(count + 1);
    }

    const onDecrease = () => {
        setCount(count - 1);
    }

    return (
        <div>
            {/* 1 */}
            {/* <h2>0</h2> */}
            {/* <button>+</button> */}
            {/* <button>-</button> */}
            
            {/* 2 */}
            <h2>{count}</h2>
            <button onClick={onIncrease}>+</button>
            <button onClick={onDecrease}>-</button>
            
            {/* 3 */}
            <CounterResult num={count} />
        </div>
    )
}

Counter.defaultProps = {
    initialNum: 0,
}

export default Counter;
