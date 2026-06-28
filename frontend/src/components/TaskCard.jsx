import React, { useState } from 'react';
import { Calendar, Edit2, Trash2, Check, ChevronDown, ChevronRight } from 'lucide-react';
import GlassCard from './GlassCard';

const TaskCard = ({ task, onToggleStatus, onEdit, onDelete, onSubtaskToggle }) => {
  const { _id, title, description, status, priority, dueDate, tags, subtasks } = task;

  const [isExpanded, setIsExpanded] = useState(true);

  
  const subtasksList = Array.isArray(subtasks) ? subtasks : [];
  const tagsList = Array.isArray(tags) ? tags : [];

  const isCompleted = status === 'completed';
  const hasSubtasks = subtasksList.length > 0;
  const completedSubtasks = subtasksList.filter(st => st.isCompleted).length;
  const progressPercentage = hasSubtasks ? Math.round((completedSubtasks / subtasksList.length) * 100) : 0;

  
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  
  const isOverdue = (() => {
    if (!dueDate || isCompleted) return false;
    return new Date() > new Date(dueDate);
  })();

  const handleCheckboxChange = () => {
    const nextStatus = isCompleted ? 'pending' : 'completed';
    onToggleStatus(_id, nextStatus);
  };

  const handleMouseMove = (e) => {
    const { currentTarget, clientX, clientY } = e;
    const rect = currentTarget.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    currentTarget.style.setProperty('--mouse-x', `${x}px`);
    currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <GlassCard 
      className={`task-card spotlight-card priority-${priority} status-${status}`}
      onMouseMove={handleMouseMove}
    >
      <div className="task-header">
        <div className="task-checkbox-container">
          <label className="task-checkbox-wrapper">
            <input 
              type="checkbox" 
              checked={isCompleted}
              onChange={handleCheckboxChange}
            />
            <div className="custom-checkbox">
              <Check size={10} strokeWidth={2.5} />
            </div>
          </label>
          <div className="task-title-group">
            <h3 className="task-title">{title}</h3>
          </div>
        </div>
        
        <div className="task-actions">
          <button 
            className="btn-icon edit" 
            onClick={() => onEdit(task)}
            title="Edit Task"
          >
            <Edit2 size={14} />
          </button>
          <button 
            className="btn-icon delete" 
            onClick={() => onDelete(_id)}
            title="Delete Task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <p className="task-desc">{description || 'No description provided.'}</p>

      
      {hasSubtasks && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div 
            style={{ 
              fontSize: '0.8rem', 
              color: 'var(--text-secondary)',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <button 
              className="task-subtasks-toggle-btn"
              onClick={() => setIsExpanded(!isExpanded)}
              type="button"
            >
              {isExpanded ? <ChevronDown size={14} strokeWidth={1.8} /> : <ChevronRight size={14} strokeWidth={1.8} />}
              <span>Subtasks ({completedSubtasks}/{subtasksList.length})</span>
            </button>
            <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{progressPercentage}%</span>
          </div>
          
          <div className="subtasks-progress-container">
            <div 
              className={`subtasks-progress-bar ${isCompleted ? 'completed' : `priority-${priority}`}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {isExpanded && (
            <div className="task-subtasks-list">
              {subtasksList.map((st) => (
                <label 
                  key={st._id} 
                  className={`task-subtask-item ${st.isCompleted ? 'completed' : ''}`}
                >
                  <input 
                    type="checkbox" 
                    checked={st.isCompleted} 
                    onChange={() => onSubtaskToggle(_id, st._id, !st.isCompleted)}
                  />
                  <span>{st.title}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="task-meta">
        {dueDate ? (
          <div className={`task-date ${isOverdue ? 'overdue' : ''}`}>
            <Calendar size={12} />
            <span>
              {formatDate(dueDate)}
              {isOverdue && ' (Overdue)'}
            </span>
          </div>
        ) : (
          <div className="task-date" style={{ opacity: 0.5 }}>
            <span>No due date</span>
          </div>
        )}

        <div className="task-tags">
          {tagsList.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="tag-badge">
              {tag}
            </span>
          ))}
          {tagsList.length > 2 && (
            <span className="tag-badge" style={{ opacity: 0.6 }}>
              +{tagsList.length - 2}
            </span>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default TaskCard;
