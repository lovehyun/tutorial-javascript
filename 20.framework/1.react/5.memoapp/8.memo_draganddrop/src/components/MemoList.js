// https://github.com/atlassian/react-beautiful-dnd
// https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/about/examples.md
import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import MemoItem from './MemoItem';

const MemoList = ({ memos, onDeleteMemo, onEditMemo, onToggleComplete, onReorderMemos }) => {
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
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="memo-list"
                    >
                        {memos.map((memo, index) => (
                            <MemoItem
                                key={memo.id}
                                memo={memo}
                                index={index} // Draggable에 필요한 index 전달
                                onDeleteMemo={onDeleteMemo}
                                onEditMemo={onEditMemo}
                                onToggleComplete={onToggleComplete}
                            />
                        ))}
                        {provided.placeholder} {/* 드롭 가능한 영역의 공간 확보 */}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default MemoList;
