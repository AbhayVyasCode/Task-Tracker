import React, { useEffect } from 'react';
import { CheckCircle2, AlertOctagon, X } from 'lucide-react';

const Toast = ({ toast, onDismiss }) => {
  const { id, message, type = 'success' } = toast;

  useEffect(() => {
    
    const timer = setTimeout(() => {
      onDismiss(id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <div className={`toast obsidian-panel toast-${type}`}>
      {type === 'success' ? (
        <CheckCircle2 size={18} color="#38ef7d" />
      ) : (
        <AlertOctagon size={18} color="#ff4b2b" />
      )}
      <span style={{ fontSize: '0.9rem', fontWeight: 500, flex: 1 }}>
        {message}
      </span>
      <button 
        onClick={() => onDismiss(id)}
        style={{ 
          background: 'transparent', 
          border: 'none', 
          cursor: 'pointer', 
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;
