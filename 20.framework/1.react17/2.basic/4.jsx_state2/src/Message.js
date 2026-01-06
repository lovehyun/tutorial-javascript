// import React from 'react';
// import './Message.css'; // CSS 파일 import

const Message = ({ count }) => {
    // const messageStyle = {
        //     backgroundColor: '#282c34',
        //     color: '#61dafb',
        //     padding: '10px',
        //     borderRadius: '10px',
        //     textAlign: 'center',
        //     fontWeight: 'bold',
        // };
        
        
    return <p>The current count is: {count}</p>;
    
    // React의 style 속성을 사용하여 인라인으로 스타일을 정의 (CSS-in-JS)
    // return <p style={messageStyle}>The current count is: {count}</p>;
    
    // 전통적인 CSS 스타일링 방식
    // return <p className="message">The current count is: {count}</p>;
};

export default Message;
