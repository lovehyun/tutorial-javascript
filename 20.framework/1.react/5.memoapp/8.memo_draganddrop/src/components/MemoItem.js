import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

// const MemoItem = ({ memo, index, onDeleteMemo, onEditMemo, onToggleComplete }) => {
//     return (
//         <Draggable draggableId={memo.id.toString()} index={index}>
//             {(provided) => (
//                 <div
//                     ref={provided.innerRef}
//                     {...provided.draggableProps}
//                     {...provided.dragHandleProps}
//                     className={`memo-item ${memo.completed ? 'completed' : ''}`}
//                 >
//                     {/* 완료 상태 체크박스 */}
//                     <input
//                         type="checkbox"
//                         checked={memo.completed}
//                         onChange={() => onToggleComplete(memo.id)}
//                         className="checkbox"
//                     />
//                     {/* 메모 텍스트 */}
//                     <input
//                         type="text"
//                         value={memo.text}
//                         onChange={(e) => onEditMemo(memo.id, e.target.value)}
//                         disabled={memo.completed}
//                     />
//                     {/* 삭제 버튼 */}
//                     <button onClick={() => onDeleteMemo(memo.id)}>삭제</button>
//                 </div>
//             )}
//         </Draggable>
//     );
// };

// drag 핸들 추가
// const MemoItem = ({ memo, index, onDeleteMemo, onEditMemo, onToggleComplete }) => {
//     return (
//         <Draggable draggableId={memo.id.toString()} index={index}>
//             {(provided) => (
//                 <div
//                     ref={provided.innerRef}
//                     {...provided.draggableProps}
//                     {...provided.dragHandleProps}
//                     className={`memo-item ${memo.completed ? 'completed' : ''}`}
//                 >
//                     {/* 완료 상태 체크박스 */}
//                     <input
//                         type="checkbox"
//                         checked={memo.completed}
//                         onChange={() => onToggleComplete(memo.id)}
//                         className="checkbox"
//                     />
//                     {/* 메모 텍스트 */}
//                     <input
//                         type="text"
//                         value={memo.text}
//                         onChange={(e) => onEditMemo(memo.id, e.target.value)}
//                         disabled={memo.completed}
//                     />
//                     {/* 삭제 버튼 */}
//                     <button onClick={() => onDeleteMemo(memo.id)}>삭제</button>
//                     {/* 햄버거 아이콘 (드래그 핸들) */}
//                     <span
//                         {...provided.dragHandleProps}
//                         className="drag-handle"
//                         title="드래그하여 이동"
//                     >
//                         ≡
//                     </span>
//                 </div>
//             )}
//         </Draggable>
//     );

// 드래그 하는 동안 css 디자인 dragging 적용
const MemoItem = ({ memo, index, onDeleteMemo, onEditMemo, onToggleComplete }) => {
    return (
        <Draggable draggableId={memo.id.toString()} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`memo-item ${
                        snapshot.isDragging ? 'dragging' : '' // 드래그 중인 경우 'dragging' 클래스 추가
                    } ${memo.completed ? 'completed' : ''}`}
                >
                    {/* 완료 상태 체크박스 */}
                    <input
                        type="checkbox"
                        checked={memo.completed}
                        onChange={() => onToggleComplete(memo.id)}
                        className="checkbox"
                    />
                    {/* 메모 텍스트 */}
                    <input
                        type="text"
                        value={memo.text}
                        onChange={(e) => onEditMemo(memo.id, e.target.value)}
                        disabled={memo.completed}
                    />
                    {/* 삭제 버튼 */}
                    <button onClick={() => onDeleteMemo(memo.id)}>삭제</button>
                    {/* 햄버거 아이콘 (드래그 핸들) */}
                    <span
                        {...provided.dragHandleProps}
                        className="drag-handle"
                        title="드래그하여 이동"
                    >
                        ≡
                    </span>
                </div>
            )}
        </Draggable>
    );
};

export default MemoItem;
