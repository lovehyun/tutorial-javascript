import React, { useState } from 'react';

// 메모 추가 폼 컴포넌트
const MemoForm = ({ onAddMemo }) => {
    // 입력 필드의 상태를 관리
    const [input, setInput] = useState('');

    // 폼 제출 시 호출되는 함수
    const handleSubmit = (e) => {
        e.preventDefault(); // 기본 폼 제출 동작(페이지 새로고침) 방지
        if (input.trim()) { // 입력 값이 비어있지 않을 때만 실행
            onAddMemo(input); // 부모 컴포넌트로 입력된 메모 전달
            setInput(''); // 입력 필드 초기화
        }
    };

    return (
        // 메모 추가 폼
        <form onSubmit={handleSubmit} className="memo-form">
            {/* 메모 입력 필드 */}
            <input
                type="text"
                value={input} // 입력 필드 값
                onChange={(e) => setInput(e.target.value)} // 입력값 변경 시 상태 업데이트
                placeholder="메모를 입력하세요" // 사용자 안내 텍스트
            />
            {/* 추가 버튼 */}
            <button type="submit">추가</button>
        </form>
    );
};

export default MemoForm; // 컴포넌트 내보내기
