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
    const [showComponent, setShowComponent] = useState(true);

    // const handleCountChange = (newCount) => {
    //     setCount(newCount);
    // };

    const MyComponent = () => {
        useEffect(() => {
            console.log('컴포넌트 mounting');
            return () => {
                console.log('컴포넌트 unmounting');
            };
        }, []);
    
        return <div>My Component</div>;
    };

    return (
        <div>
            {/* Props로 데이터를 전달 */}
            <Header title={pageTitle} />
            <main>
                <p>This is the main content area.</p>
                <Counter count={count} setCount={setCount} />
                {/* <Counter count={count} setCount={handleCountChange} /> */}
                <Input setMessage={setMessage} />
                <Message count={count} message={message} />
                <button onClick={() => setShowComponent(!showComponent)}>
                    Toggle Component
                </button>
                {showComponent && <MyComponent />}
            </main>
            <Footer />
        </div>
    );
};

export default App;
