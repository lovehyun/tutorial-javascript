import React, { useState } from "react";
import Header from './Header';
import Footer from './Footer';
import Counter from './Counter';
import Message from "./Message"; // Message 추가
import Input from "./Input"; // Input 추가

const App = () => {
    const pageTitle = 'Welcome to My Website';
    const [count, setCount] = useState(0); // Counter 상태
    const [message, setMessage] = useState(''); // Input에서 사용될 메시지 상태

    return (
        <div>
            {/* Props로 데이터를 전달 */}
            <Header title={pageTitle} />
            <main>
                <p>This is the main content area.</p>
                <Counter count={count} setCount={setCount} />
                <Message count={count} message={message} />
                <Input setMessage={setMessage} />
            </main>
            <Footer />
        </div>
    );
};

export default App;
