import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Field } from './Field';

export function TaskCard({ task, index, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || ''); // New state
  const [editStart, setEditStart] = useState(task.startDate || '');
  const [editEnd, setEditEnd] = useState(task.endDate || '');

  async function save() {
    await onUpdate(task.id, { 
      title: editTitle, 
      description: editDesc, // Include description
      startDate: editStart || null, 
      endDate: editEnd || null 
    });
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-md border border-gray-100 mb-3 cursor-default">
        <Field label="Title" value={editTitle} onChange={setEditTitle} className="text-xs" />
        <div className="mt-2">
            <Field label="Description" type="textarea" value={editDesc} onChange={setEditDesc} className="text-xs" />
        </div>
        <div className="flex gap-2 mt-2">
          <Field label="Start" type="date" value={editStart} onChange={setEditStart} className="text-xs" />
          <Field label="End" type="date" value={editEnd} onChange={setEditEnd} className="text-xs" />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700" onClick={() => setIsEditing(false)}>Cancel</button>
          <button className="px-3 py-1 bg-pastel-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors" onClick={save}>Save</button>
        </div>
      </div>
    );
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
          className={`mb-3 outline-none ${snapshot.isDragging ? 'z-50' : ''}`}
        >
          <div 
            className={`
                group relative bg-white p-4 rounded-xl shadow-sm border border-gray-100 
                hover:shadow-lg hover:border-pastel-blue-200 
                transition-all duration-200 
                ${snapshot.isDragging ? 'shadow-2xl rotate-2 scale-105' : ''}
            `}
          >
            <div className="pr-6">
                <div className={`font-semibold text-gray-700 group-hover:text-black group-hover:font-bold transition-all`}>{task.title}</div>
                {(task.startDate || task.endDate) && (
                    <div className="text-xs text-gray-400 group-hover:text-blue-500 mt-1 font-medium">
                        {task.startDate || '?'} ~ {task.endDate || '?'}
                    </div>
                )}
            </div>
            
            <div className="flex justify-end gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-gray-400 hover:text-pastel-blue-500 hover:bg-pastel-blue-50 rounded-lg transition-all" 
                  onClick={() => setIsEditing(true)}
                  title="Edit"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                    <path d="m15 5 4 4"/>
                  </svg>
                  Edit
                </button>
                <button 
                  className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" 
                  onClick={() => onDelete(task.id)}
                  title="Delete"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                  </svg>
                  Delete
                </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
