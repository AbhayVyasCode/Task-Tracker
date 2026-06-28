import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import GlassCard from './GlassCard';

const TaskModal = ({ isOpen, onClose, onSubmit, task = null }) => {
  const tagsInputRef = useRef(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  
  
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  
  const [subtasks, setSubtasks] = useState([]);
  const [subtaskInput, setSubtaskInput] = useState('');

  
  const [errors, setErrors] = useState();
  const [touched, setTouched] = useState();

  useEffect(() => {
    if (task) {
      
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'pending');
      setPriority(task.priority || 'medium');
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
      setTags(task.tags || []);
      setSubtasks(task.subtasks || []);
    } else {
      
      setTitle('');
      setDescription('');
      setStatus('pending');
      setPriority('medium');
      setDueDate('');
      setTags([]);
      setSubtasks([]);
    }
    setErrors({});
    setTouched({});
  }, [task, isOpen]);

  // Form Field Validation
  const validate = () => {
    const newErrors = {};
    if (!title || title.trim() === '') {
      newErrors.title = 'Title is required';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }

    if (description && description.trim().length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    if (dueDate) {
      const parsedDate = Date.parse(dueDate);
      if (isNaN(parsedDate)) {
        newErrors.dueDate = 'Please enter a valid date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validate();
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    
    setTouched({
      title: true,
      description: true,
      dueDate: true
    });

    if (!validate()) return;

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: dueDate || null,
      tags,
      subtasks
    };

    onSubmit(taskData);
  };

  
  const handleTagAdd = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim();
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput('');
      }
    }
  };

  
  const handleTagRemove = (indexToRemove) => {
    setTags(tags.filter((_, idx) => idx !== indexToRemove));
  };

  
  const handleSubtaskAdd = (e) => {
    e.preventDefault();
    const val = subtaskInput.trim();
    if (val) {
      setSubtasks([...subtasks, { title: val, isCompleted: false }]);
      setSubtaskInput('');
    }
  };

  
  const handleSubtaskToggle = (idx) => {
    const updated = subtasks.map((st, i) => 
      i === idx ? { ...st, isCompleted: !st.isCompleted } : st
    );
    setSubtasks(updated);
  };

  
  const handleSubtaskRemove = (idx) => {
    setSubtasks(subtasks.filter((_, i) => i !== idx));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <GlassCard 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{task ? 'Modify Task Details' : 'Create Task'}</h2>
          <X className="modal-close" onClick={onClose} size={20} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="task-title">Title *</label>
            <input
              type="text"
              id="task-title"
              className={`form-control ${touched.title && errors.title ? 'form-control-error' : ''}`}
              placeholder="e.g. Code database connection"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => handleBlur('title')}
              required
            />
            {touched.title && errors.title && (
              <span className="error-message">{errors.title}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              className={`form-control ${touched.description && errors.description ? 'form-control-error' : ''}`}
              rows="3"
              placeholder="Provide a detailed log for this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => handleBlur('description')}
            />
            {touched.description && errors.description && (
              <span className="error-message">{errors.description}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-status">Status</label>
              <div className="select-wrapper">
                <select
                  id="task-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="task-priority">Priority</label>
              <div className="select-wrapper">
                <select
                  id="task-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="task-duedate">Due Date</label>
            <input
              type="date"
              id="task-duedate"
              className={`form-control ${touched.dueDate && errors.dueDate ? 'form-control-error' : ''}`}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              onBlur={() => handleBlur('dueDate')}
            />
            {touched.dueDate && errors.dueDate && (
              <span className="error-message">{errors.dueDate}</span>
            )}
          </div>

          
          <div className="form-group">
            <label>Tags (Press Enter to insert)</label>
            <div 
              className="tags-input-container" 
              onClick={() => tagsInputRef.current?.focus()}
              style={{ cursor: 'text' }}
            >
              {tags.map((tag, idx) => (
                <span key={idx} className="tag-chip" onClick={(e) => e.stopPropagation()}>
                  {tag}
                  <X size={12} onClick={() => handleTagRemove(idx)} />
                </span>
              ))}
              <input
                ref={tagsInputRef}
                type="text"
                placeholder={tags.length === 0 ? "Add tags (e.g. Design, API)..." : ""}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagAdd}
              />
            </div>
          </div>

          
          <div className="subtasks-section">
            <label style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Subtask Checklist
            </label>
            <div className="subtask-input-row" style={{ marginTop: '8px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Add subtask title..."
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
              />
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={handleSubtaskAdd}
                style={{ padding: '0 16px' }}
              >
                <Plus size={16} />
              </button>
            </div>

            {subtasks.length > 0 && (
              <div className="subtasks-list">
                {subtasks.map((st, idx) => (
                  <div key={idx} className="subtask-builder-item">
                    <label className="subtask-title-display">
                      <input 
                        type="checkbox" 
                        checked={st.isCompleted} 
                        onChange={() => handleSubtaskToggle(idx)}
                        style={{ marginRight: '6px' }}
                      />
                      <span style={st.isCompleted ? { textDecoration: 'line-through', opacity: 0.6 } : {}}>
                        {st.title}
                      </span>
                    </label>
                    <button 
                      type="button" 
                      className="btn-icon delete" 
                      onClick={() => handleSubtaskRemove(idx)}
                      style={{ padding: '4px' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
            >
              {task ? 'Save Changes' : 'Launch Task'}
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default TaskModal;
