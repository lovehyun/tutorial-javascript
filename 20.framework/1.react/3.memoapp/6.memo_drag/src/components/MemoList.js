import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const MemoList = ({ memos, onDeleteMemo, onToggleComplete, onEditMemo, onReorderMemos }) => {
    const handleDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) {
            console.log('드롭 위치가 없습니다.');
            return;
        }
        if (source.index === destination.index) {
            console.log('같은 위치로 드롭되었습니다.');
            return;
        }

        console.log(`드래그 시작: ${source.index}, 드롭 위치: ${destination.index}`);

        onReorderMemos(source.index, destination.index); // 순서 변경 함수 호출
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="memo-list">
                {(provided) => (
                    <div
                        ref={provided.innerRef} // ref 전달
                        {...provided.droppableProps} // 드롭 가능 속성 전달
                        className="memo-list"
                    >
                        {memos.length > 0 ? (
                            memos.map((memo, index) => (
                                <Draggable key={memo.id} draggableId={memo.id.toString()} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef} // ref 전달
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`memo-item ${memo.completed ? 'completed' : ''}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={memo.completed}
                                                onChange={() => onToggleComplete(memo.id)}
                                                className="checkbox"
                                            />
                                            <input
                                                type="text"
                                                value={memo.text}
                                                onChange={(e) => onEditMemo(memo.id, e.target.value)}
                                                disabled={memo.completed}
                                            />
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
                            ))
                        ) : (
                            <p>메모가 없습니다.</p>
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default MemoList;
