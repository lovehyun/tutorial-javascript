import React, { useMemo, useState } from 'react';

export function GanttView({ tasks, columns, onClose }) {
  const [viewMode, setViewMode] = useState('wide'); // 'wide' | 'narrow'
  const { dateRange, days, processedTasks } = useMemo(() => {
    let minDate = new Date();
    let maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7); // Valid initial range

    const validTasks = tasks
        .filter(t => t.startDate && t.endDate)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    
    if (validTasks.length > 0) {
      const startDates = validTasks.map(t => new Date(t.startDate));
      const endDates = validTasks.map(t => new Date(t.endDate));
      minDate = new Date(Math.min(...startDates));
      maxDate = new Date(Math.max(...endDates));
    }

    // Buffer
    minDate.setDate(minDate.getDate() - 2);
    maxDate.setDate(maxDate.getDate() + 2);

    const days = [];
    let curr = new Date(minDate);
    while (curr <= maxDate) {
      days.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }

    return { 
      dateRange: { min: minDate, max: maxDate }, 
      days, 
      processedTasks: validTasks 
    };
  }, [tasks]);

  const formatDate = (d) => d.toISOString().split('T')[0];

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 bg-white rounded-3xl shadow-xl border border-gray-100 my-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-extrabold text-gray-800">Gantt Chart</h2>
        <div className="flex gap-3">
            <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
                <button 
                    className={`px-3 py-1.5 text-sm font-bold rounded-lg transition-all ${viewMode === 'wide' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    onClick={() => setViewMode('wide')}
                >
                    Wide
                </button>
                <button 
                    className={`px-3 py-1.5 text-sm font-bold rounded-lg transition-all ${viewMode === 'narrow' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    onClick={() => setViewMode('narrow')}
                >
                    Narrow
                </button>
            </div>
            <button className="px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors" onClick={onClose}>Close</button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-inner custom-scrollbar">
        <table className="w-full border-collapse text-sm">
            <thead>
                <tr>
                    <th className="p-4 border-b border-gray-200 min-w-[200px] text-left sticky left-0 bg-white z-20 shadow-[2px_0_5px_rgba(0,0,0,0.05)] text-gray-500 font-medium">Task</th>
                    {days.map(d => (
                        <th key={d.toISOString()} className={`p-2 border-b border-gray-200 border-l border-gray-100 ${viewMode === 'wide' ? 'min-w-[50px]' : 'min-w-[25px]'} text-center bg-gray-50`}>
                            <div className="font-bold text-gray-700">{d.getDate()}</div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-wide">{d.toLocaleString('default', { month: 'short' })}</div>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {processedTasks.map(task => (
                    <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 border-b border-gray-100 sticky left-0 bg-white z-10 shadow-[2px_0_5px_rgba(0,0,0,0.05)] font-semibold text-gray-700">
                            <div className="flex items-center gap-2">
                                {(() => {
                                    const colIndex = columns ? columns.findIndex(c => c.id === task.columnId) : 0;
                                    const idx = colIndex >= 0 ? colIndex : 0;
                                    const icons = [
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pastel-blue-500 flex-shrink-0"><circle cx="12" cy="12" r="10"/></svg>,
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pastel-green-500 flex-shrink-0"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>,
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pastel-purple-500 flex-shrink-0"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>,
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pastel-red-500 flex-shrink-0"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>
                                    ];
                                    return icons[idx % icons.length];
                                })()}
                                <span className="truncate">{task.title}</span>
                            </div>
                        </td>
                        {days.map(d => {
                            const dStr = formatDate(d);
                            const start = task.startDate.split('T')[0];
                            const end = task.endDate.split('T')[0];
                            const isWithin = dStr >= start && dStr <= end;
                            const isStart = dStr === start;
                            const isEnd = dStr === end;
                            
                            let bgClass = '';
                            if (isWithin) {
                                // Find column index for color
                                const colIndex = columns ? columns.findIndex(c => c.id === task.columnId) : 0;
                                const safeIndex = colIndex >= 0 ? colIndex : 0;
                                
                                // Darker shades mapping to Board's 100 shades
                                const darkColors = ['bg-pastel-blue-500', 'bg-pastel-green-500', 'bg-pastel-purple-500', 'bg-pastel-red-500'];
                                bgClass = darkColors[safeIndex % darkColors.length];
                            }

                            return (
                                <td key={d.toISOString()} className={`p-0 border-b border-gray-100 border-l border-gray-100 h-12 relative`}>
                                    {isWithin && (
                                        <div 
                                            className={`absolute inset-y-2 left-0 right-0 ${bgClass} opacity-80 ${isStart ? 'rounded-l-lg' : ''} ${isEnd ? 'rounded-r-lg' : ''} shadow-sm group hover:opacity-100 hover:scale-[1.02] transition-all cursor-pointer`}
                                            title={`${task.title}: ${start} ~ ${end}${task.description ? '\n' + task.description : ''}`}
                                        ></div>
                                    )}
                                </td>
                            );
                        })}
                    </tr>
                ))}
                {processedTasks.length === 0 && (
                    <tr>
                        <td colSpan={days.length + 1} className="p-10 text-center text-gray-400 italic">
                            No tasks with Start and End dates found.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
}
