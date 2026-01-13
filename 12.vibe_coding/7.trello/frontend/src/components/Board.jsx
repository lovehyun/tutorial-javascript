import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api.js';
import { TaskCard } from './TaskCard';
import { GanttView } from './GanttView';
import { useModal } from './Modal';

export function Board({ projectId }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get('view') || 'board';
  
  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState(null);
  const [err, setErr] = useState('');
  const [newTitleByCol, setNewTitleByCol] = useState({});

  async function load() {
    setLoading(true);
    setErr('');
    try {
      const data = await api.board(projectId);
      setBoard(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [projectId]);

  async function addTask(columnId) {
    const title = (newTitleByCol[columnId] || '').trim();
    if (!title) return;
    await api.createTask(columnId, { title, description: '' });
    setNewTitleByCol((p) => ({ ...p, [columnId]: '' }));
    load();
  }

  async function onDragEnd(result) {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
        return;
    }

    // Optimistic Update
    const startColId = source.droppableId;
    const endColId = destination.droppableId;

    const newBoard = { ...board };
    const startTasks = Array.from(newBoard.tasksByColumn[startColId] || []);
    let endTasks = startColId === endColId ? startTasks : Array.from(newBoard.tasksByColumn[endColId] || []);

    const [moved] = startTasks.splice(source.index, 1);
    endTasks.splice(destination.index, 0, moved);

    newBoard.tasksByColumn[startColId] = startTasks;
    newBoard.tasksByColumn[endColId] = endTasks;
    setBoard(newBoard);

    try {
        await api.moveTask(draggableId, { 
            toColumnId: endColId, 
            toOrder: destination.index + 1 // API expects 1-based order
        });
    } catch (e) {
        console.error("Move failed", e);
        load(); // Revert on failure
    }
  }

  async function updateTask(taskId, changes) {
      await api.updateTask(taskId, changes);
      load();
  }

  const { confirm } = useModal();

  // ... (existing code, need to locate remove function)

  async function remove(taskId) {
    const ok = await confirm('Delete Task', 'Are you sure you want to delete this task?');
    if (!ok) return;
    await api.deleteTask(taskId);
    load();
  }

  if (loading && !board) return <div className="p-8 flex justify-center"><div className="animate-pulse text-gray-400">Loading Board...</div></div>;
  if (err) return <div className="p-8"><div className="bg-red-50 text-red-500 p-4 rounded-xl">Error: {err}</div></div>;
  if (!board) return null;

  if (view === 'gantt') {
      const allTasks = Object.values(board.tasksByColumn).flat();
      return <GanttView tasks={allTasks} columns={board.columns} onClose={() => setSearchParams({ view: 'board' })} />;
  }

  const bgColors = ['bg-pastel-blue-100', 'bg-pastel-green-100', 'bg-pastel-purple-100', 'bg-pastel-red-100'];

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800">{board.projectName}</h2>
        <div className="flex gap-3">
            <button className="px-4 py-2 bg-white text-pastel-purple-500 font-bold rounded-xl shadow-sm hover:shadow-md hover:bg-pastel-purple-100 transition-all" onClick={() => setSearchParams({ view: 'gantt' })}>Gantt View</button>
        </div>
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4 items-start h-full">
            {board.columns.map((col, idx) => {
              const bgColors = ['bg-pastel-blue-100', 'bg-pastel-green-100', 'bg-pastel-purple-100', 'bg-pastel-red-100'];
              const bgClass = bgColors[idx % bgColors.length];
              
              const icons = [
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pastel-blue-500"><circle cx="12" cy="12" r="10"/></svg>,
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pastel-green-500"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>,
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pastel-purple-500"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>,
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pastel-red-500"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>
              ];
              const Icon = icons[idx % icons.length];

              return (
                <div className={`${bgClass} rounded-2xl p-4 flex flex-col flex-shrink-0 w-80 max-h-[calc(100vh-200px)] overflow-hidden shadow-sm`} key={col.id}>
                    <div className="flex items-center gap-2 mb-4 px-2">
                        {Icon}
                        <h3 className="font-bold text-gray-700 uppercase text-xs tracking-wider translate-y-[1px]">{col.name}</h3>
                    </div>

                    <div className="flex gap-2 mb-4 px-1">
                        <input
                            className="flex-1 px-3 py-2 text-sm rounded-lg border-transparent focus:border-pastel-blue-500 focus:ring-2 focus:ring-pastel-blue-200 shadow-sm transition-all"
                            placeholder="+ New Task"
                            value={newTitleByCol[col.id] || ''}
                            onChange={(e) => setNewTitleByCol((p) => ({ ...p, [col.id]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && addTask(col.id)}
                        />
                    </div>

                    <Droppable droppableId={col.id}>
                        {(provided) => (
                            <div 
                                ref={provided.innerRef} 
                                {...provided.droppableProps}
                                className="flex-1 overflow-y-auto px-1 pb-4 custom-scrollbar"
                                style={{ minHeight: 100 }}
                            >
                                {(board.tasksByColumn[col.id] || []).map((t, index) => (
                                    <TaskCard 
                                        key={t.id} 
                                        task={t} 
                                        index={index} 
                                        onDelete={remove}
                                        onUpdate={updateTask}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
              );
            })}
        </div>
      </DragDropContext>
    </div>
  );
}
