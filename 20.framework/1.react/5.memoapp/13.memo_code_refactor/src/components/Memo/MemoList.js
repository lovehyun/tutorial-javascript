import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import MemoItem from './MemoItem';
import styles from '../../styles/MemoList.module.css';

const MemoList = ({
    memos,
    onDeleteMemo,
    onEditMemo,
    onToggleComplete,
    onReorderMemos,
    onOpenDetail,
}) => {
    const handleDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination || source.index === destination.index) return;
        onReorderMemos(source.index, destination.index);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="memo-list">
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={styles['memo-list']}
                    >
                        {memos.map((memo, index) => (
                            <MemoItem
                                key={memo.id}
                                memo={memo}
                                index={index}
                                onDeleteMemo={onDeleteMemo}
                                onEditMemo={onEditMemo}
                                onToggleComplete={onToggleComplete}
                                onOpenDetail={onOpenDetail}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default MemoList;
