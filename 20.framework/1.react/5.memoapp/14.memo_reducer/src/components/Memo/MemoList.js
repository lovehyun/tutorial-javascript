import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import MemoItem from './MemoItem';
import { useMemoContext } from '../../context/MemoProvider';
import styles from '../../styles/MemoList.module.css';

const MemoList = ({ memos }) => {
    const { dispatch } = useMemoContext();

    const handleDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination || source.index === destination.index) {
            return;
        }

        const reorderedMemos = Array.from(memos);
        const [removed] = reorderedMemos.splice(source.index, 1);
        reorderedMemos.splice(destination.index, 0, removed);

        dispatch({ type: 'SET_SORT_ORDER', payload: 'manual' });
        dispatch({ type: 'EDIT_MEMO', payload: { id: null, data: reorderedMemos } });
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
                            <MemoItem key={memo.id} memo={memo} index={index} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default MemoList;
