import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styles from '../../styles/MemoItem.module.css';

const MemoItem = ({
    memo,
    index,
    onDeleteMemo,
    onEditMemo,
    onToggleComplete,
    onOpenDetail,
}) => {
    return (
        <Draggable draggableId={memo.id.toString()} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`${styles['memo-item']} ${
                        snapshot.isDragging ? styles['dragging'] : ''
                    } ${memo.completed ? styles['completed'] : ''}`}
                >
                    <input
                        type="checkbox"
                        checked={memo.completed}
                        onChange={() => onToggleComplete(memo.id)}
                        className={styles['checkbox']}
                    />
                    <input
                        type="text"
                        value={memo.text}
                        onChange={(e) => onEditMemo(memo.id, e.target.value)}
                        disabled={memo.completed} // 완료된 메모는 수정 불가
                        className={styles['text-input']}
                    />
                    <div className={styles['button-group']}>
                        <button
                            onClick={() => onOpenDetail(memo.id)}
                            className={styles['detail-button']}
                        >
                            상세
                        </button>
                        <button
                            onClick={() => onDeleteMemo(memo.id)}
                            className={styles['delete-button']}
                        >
                            삭제
                        </button>
                    </div>
                    <span
                        {...provided.dragHandleProps}
                        className={styles['drag-handle']}
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
