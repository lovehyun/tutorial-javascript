import React from "react";

const Input = ({ setMessage }) => {
    // onChange 핸들러 함수 정의
    // const handleChange = (e) => {
    //     const newValue = e.target.value; // 입력된 값 가져오기
    //     console.log("Current input value:", newValue); // 디버깅용 로그
    //     setMessage(newValue); // 부모 상태 업데이트
    // };

    return (
        <div>
            <label>Enter a message: </label>
            <input
                type="text"
                onChange={(e) => setMessage(e.target.value)}
                // onChange={handleChange} // 핸들러 함수 연결
                placeholder="Type here..."
            />
        </div>
    );
};

export default Input;
