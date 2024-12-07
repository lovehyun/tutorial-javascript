import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import MemoItem from './MemoItem';
import { useDispatch } from 'react-redux';
import { editMemo, setSortOrder } from '../../store/memoSlice';
import styles from '../../styles/MemoList.module.css';

const MemoList = ({ memos }) => {
    const dispatch = useDispatch();

    const handleDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination || source.index === destination.index) {
            return;
        }

        const reorderedMemos = Array.from(memos);
        const [removed] = reorderedMemos.splice(source.index, 1);
        reorderedMemos.splice(destination.index, 0, removed);

        dispatch(setSortOrder('manual'));
        dispatch(editMemo({ id: null, data: reorderedMemos }));
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
