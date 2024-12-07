import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useMemoContext } from '../../context/MemoProvider';
import styles from '../../styles/MemoItem.module.css';

const MemoItem = ({ memo, index }) => {
    const { dispatch } = useMemoContext();

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
                        onChange={() =>
                            dispatch({ type: 'TOGGLE_COMPLETE', payload: memo.id })
                        }
                        className={styles['checkbox']}
                    />
                    <input
                        type="text"
                        value={memo.text}
                        onChange={(e) =>
                            dispatch({
                                type: 'EDIT_MEMO',
                                payload: { id: memo.id, data: { text: e.target.value } },
                            })
                        }
                        disabled={memo.completed}
                        className={styles['text-input']}
                    />
                    <div className={styles['button-group']}>
                        <button
                            onClick={() =>
                                dispatch({ type: 'SET_SELECTED_MEMO', payload: memo })
                            }
                            className={styles['detail-button']}
                        >
                            상세
                        </button>
                        <button
                            onClick={() =>
                                dispatch({ type: 'DELETE_MEMO', payload: memo.id })
                            }
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
