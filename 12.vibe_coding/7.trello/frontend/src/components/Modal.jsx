import React, { createContext, useContext, useState, useRef } from 'react';

const ModalContext = createContext();

export function useModal() {
  return useContext(ModalContext);
}

export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null); // { title, content, onConfirm, onCancel, showCancel }
  const resolverRef = useRef(null);

  const show = (title, content, options = {}) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setModal({
        title,
        content,
        showCancel: options.showCancel ?? false,
        confirmText: options.confirmText || 'OK',
        cancelText: options.cancelText || 'Cancel',
        type: options.type || 'info', // info, danger
      });
    });
  };

  const confirm = (title, content) => {
    return show(title, content, { showCancel: true, confirmText: 'Confirm', type: 'danger' });
  };

  const alert = (title, content) => {
    return show(title, content, { showCancel: false });
  };

  const close = (result = false) => {
    if (resolverRef.current) {
        resolverRef.current(result);
        resolverRef.current = null;
    }
    setModal(null);
  };

  return (
    <ModalContext.Provider value={{ show, confirm, alert }}>
      {children}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{modal.title}</h3>
            <div className="text-gray-600 mb-6 leading-relaxed">
                {modal.content}
            </div>
            <div className="flex justify-end gap-3">
              {modal.showCancel && (
                <button 
                  onClick={() => close(false)}
                  className="px-4 py-2 text-gray-500 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                >
                  {modal.cancelText}
                </button>
              )}
              <button 
                onClick={() => close(true)}
                className={`px-6 py-2 rounded-xl font-bold text-white shadow-md transition-all transform active:scale-95 ${
                    modal.type === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-pastel-blue-500 hover:bg-blue-600'
                }`}
              >
                {modal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}
