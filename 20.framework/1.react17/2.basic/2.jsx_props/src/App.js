import React from 'react';
import Header from './Header';
import Footer from './Footer';

const App = () => {
    const pageTitle = 'Welcome to My Website';

    return (
        <div>
            {/* Props로 데이터를 전달 */}
            <Header title={pageTitle} />
            <main>
                <p>This is the main content area.</p>
            </main>
            <Footer />
        </div>
    );
};

export default App;
