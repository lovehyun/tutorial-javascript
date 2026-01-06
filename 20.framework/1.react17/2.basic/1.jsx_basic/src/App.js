// App.js
import React from 'react';
import Header from './Header';
import Footer from './Footer';

// 일반 함수 선언으로도 작성 가능
// function App() { return ( ) }

// Arrow function 으로 작성
const App = () => {
    return (
        <div>
            <Header />
            <main>
                <p>Welcome to my website! Here is the main content.</p>
            </main>
            <Footer />
        </div>
    );
};

export default App;
