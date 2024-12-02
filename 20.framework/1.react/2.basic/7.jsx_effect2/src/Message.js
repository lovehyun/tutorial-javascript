import React, { useEffect } from 'react';

const Message = ({ count, message }) => {

    // props 가 둘다 전달되지 않을 경우 undefined 로 전달되는데, 이때 이전 상태를 이용하기 위한 방법 -->

    // const [prevCount, setPrevCount] = useState(count); // 이전 count 저장
    // const [prevMessage, setPrevMessage] = useState(message); // 이전 message 저장

    // // count가 변경되었을 때만 업데이트
    // useEffect(() => {
    //     if (count !== undefined) {
    //         setPrevCount(count);
    //     }
    // }, [count]);

    // // message가 변경되었을 때만 업데이트
    // useEffect(() => {
    //     if (message !== undefined) {
    //         setPrevMessage(message);
    //     }
    // }, [message]);
    // <-- props 가 둘다 전달되지 않을 경우 undefined 로 전달되는데, 이때 이전 상태를 이용하기 위한 방법


    useEffect(() => {
        if (count === 10) {
            alert('Count has reached 10!');
        }
    }, [count]); // count가 변경될 때 실행

    useEffect(() => {
        document.body.style.backgroundColor = count % 2 === 0 ? 'lightblue' : 'lightcoral';

        // 컴포넌트가 언마운트되거나, useEffect가 재실행되기 전에 cleanup으로 배경색을 초기화합니다.
        return () => {
            // Cleanup: 배경색 초기화
            document.body.style.backgroundColor = '';
        };
    }, [count]); // count가 변경될 때 실행

    // 컴포넌트가 처음 렌더링될 때 초기화 작업
    useEffect(() => {
        console.log('Component mounted');
        return () => {
            console.log('Component unmounted');
        };
    }, []); // 빈 배열: 컴포넌트가 처음 렌더링될 때 한 번 실행
    
    // message가 변경될 때 브라우저 title 변경
    useEffect(() => {
        document.title = message || 'Default Title'; // message가 없으면 기본 타이틀
    }, [message]); // message가 변경될 때 실행

    return (
        <div>
            <h3>Message: {message}</h3>
            {count > 10 && <p>You've clicked more than 10 times!</p>}
        </div>
    );
};

export default Message;
