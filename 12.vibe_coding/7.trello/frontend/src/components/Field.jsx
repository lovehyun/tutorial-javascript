import React from 'react';

export function Field({ label, value, onChange, type = 'text', style, className = '' }) {
  return (
    <label className="block w-full" style={style}>
      <span className="text-gray-500 text-xs font-medium mb-1 block">{label}</span>
      {type === 'textarea' ? (
        <textarea
            className={`w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-blue-500 transition-all text-gray-700 placeholder-gray-400 shadow-sm resize-none ${className}`}
            rows={3}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input 
            className={`w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-blue-500 transition-all text-gray-700 placeholder-gray-400 shadow-sm ${className}`}
            type={type} 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
        />
      )}
    </label>
  );
}
