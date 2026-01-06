import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Counter from './Counter'; // Counter 추가

const App = () => {
    const pageTitle = 'Welcome to My Website';

    return (
        <div>
            <Header title={pageTitle} />
            <main>
                <p>This is the main content area.</p>
                {/* Counter 컴포넌트 사용 */}
                <Counter />
            </main>
            <Footer />
        </div>
    );
};

export default App;
