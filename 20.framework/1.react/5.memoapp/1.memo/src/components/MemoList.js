import React from 'react';

// 메모 목록을 표시하는 컴포넌트
const MemoList = ({ memos, onDeleteMemo, onEditMemo }) => {
    return (
        <div className="memo-list">
            {/* memos 배열을 순회하여 각 메모를 렌더링 */}
            {memos.map((memo) => (
                <div key={memo.id} className="memo-item">
                    {/* 메모 텍스트를 수정할 수 있는 입력 필드 */}
                    <input 
                        type="text" 
                        value={memo.text} // 메모의 현재 텍스트 값
                        onChange={(e) => onEditMemo(memo.id, e.target.value)} // 텍스트 변경 시 부모 함수 호출
                    />
                    {/* 메모를 삭제하는 버튼 */}
                    <button onClick={() => onDeleteMemo(memo.id)}>삭제</button>
                </div>
            ))}
        </div>
    );
};

// 메모 목록을 표시하는 컴포넌트
// const MemoList = ({ memos, onDeleteMemo, onEditMemo }) => {
//     return (
//         <div className="memo-list">
//             {/* memos 배열을 순회하여 각 메모를 렌더링 */}
//             {memos.map((memo) => {
//                 // 각 메모의 내용을 콘솔에 출력
//                 console.log("현재 메모:", memo);
//
//                 return (
//                     <div key={memo.id} className="memo-item">
//                         {/* 메모 텍스트를 수정할 수 있는 입력 필드 */}
//                         <input 
//                             type="text" 
//                             value={memo.text} // 메모의 현재 텍스트 값
//                             onChange={(e) => {
//                                 console.log(`메모 수정: ID=${memo.id}, 새로운 텍스트=${e.target.value}`); // 수정 이벤트 디버깅
//                                 onEditMemo(memo.id, e.target.value);
//                             }}
//                         />
//                         {/* 메모를 삭제하는 버튼 */}
//                         <button onClick={() => {
//                             console.log(`메모 삭제 요청: ID=${memo.id}`); // 삭제 이벤트 디버깅
//                             onDeleteMemo(memo.id);
//                         }}>
//                             삭제
//                         </button>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// };

export default MemoList; // 컴포넌트 내보내기
