function Child({ sendMessageToParent }) {
    // const handleSendMessage = () => {
    //     sendMessageToParent('안녕하세요 부모님');
    // };

    return (
        <div>
            <h3>자식</h3>
            {/* <button onClick={handleSendMessage}>부모에게 보내기</button> */}
            <button onClick={() => sendMessageToParent('안녕하세요 부모님')}>부모에게 보내기</button>
        </div>
    );
}

export default Child;

// 관례상 onSomething 시리즈로 많이 씀
// sendMessageToParent => onSend

// 내부적으로 <button> 도 React의 컴포넌트임
// <button onClick={handleClick} />
// props = {
//   onClick: handleClick
// }
//
// React가...
// element.addEventListener('click', props.onClick);
