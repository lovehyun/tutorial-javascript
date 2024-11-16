import React, { useState } from 'react';
import Message from './Message'; // Message 컴포넌트 추가

const Counter = () => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => setCount(count + 1);
  const handleDecrement = () => setCount(count - 1);

  return (
    <div>
      <h2>Counter</h2>
      {/* Props로 state 전달 */}
      <Message count={count} />
      <button onClick={handleIncrement}>Increase</button>
      <button onClick={handleDecrement}>Decrease</button>
    </div>
  );
};

export default Counter;
