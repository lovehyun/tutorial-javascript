import { useState } from 'react';

export default function App() {
    const [count, setCount] = useState(0);

    // const handleIncrease = () => {
    //     setCount(count + 1);
    // };
    //
    // const handleReset = () => {
    //     setCount(0);
    // };

    return (
        <>
            <h1>{count}</h1>
            
            {/* <button onClick={handleIncrease}>+1</button> */}

            <button onClick={() => setCount(count + 1)}>+1</button>
            
            <button onClick={() => setCount(0)}>reset</button>
        </>
    );
}
