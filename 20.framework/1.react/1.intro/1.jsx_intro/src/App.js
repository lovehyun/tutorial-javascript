// App.js
import React from 'react';
// import './App.css'; // CSS 파일을 import

// 일반 함수 선언으로도 작성 가능
// function App() { return ( ) }

// Arrow function 으로 작성
const App = () => {
    return (
        <div>
            <main>
                <p>Welcome to my website! Here is the main content.</p>
            </main>
        </div>
    );
};

// const App = () => {
//     return (
//         <div className="App"> {/* App 클래스 적용 */}
//             <header className="App-header"> {/* App-header 클래스 적용 */}
//                 <main>
//                     <p>Welcome to my website! Here is the main content.</p>
//                     <span className="App-link">main</span> content.
//                 </main>
//             </header>
//         </div>
//     );
// };

export default App;
