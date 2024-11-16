// App.js
import React from 'react';
import Header from './Header';
import Footer from './Footer';

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
