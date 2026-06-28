import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Inbox } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import Toast from './components/Toast';
import { taskApi } from './services/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt'); 
  const [sortOrder, setSortOrder] = useState('desc');
  
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarCollapsed(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts([...toasts, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(toasts.filter(t => t.id !== id));
  };

  
  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const response = await taskApi.getTasks();
      if (response.success) {
        setTasks(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      addToast(err.message || 'Could not load tasks from database.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  
  const getSidebarStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = total - completed;
    const highPriority = tasks.filter(t => t.priority === 'high').length;
    
    const overdue = tasks.filter(t => {
      if (!t.dueDate || t.status === 'completed') return false;
      return new Date() > new Date(t.dueDate);
    }).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, highPriority, overdue, completionRate };
  };

  const handleToggleStatus = async (id, newStatus) => {
    const originalTasks = [...tasks];
    let updatedSubtasks = [];

    
    setTasks(tasks.map(t => {
      if (t._id === id) {
        const subList = Array.isArray(t.subtasks) ? t.subtasks : [];
        
        updatedSubtasks = newStatus === 'completed'
          ? subList.map(st => ({ ...st, isCompleted: true }))
          : subList.map(st => ({ ...st, isCompleted: false }));
        return { ...t, status: newStatus, subtasks: updatedSubtasks };
      }
      return t;
    }));

    const toastMessage = newStatus === 'completed' 
      ? 'Task marked as completed! Nice.' 
      : 'Task reactivated to in-progress.';
    addToast(toastMessage, 'success');

    try {
      
      await taskApi.updateTask(id, { 
        status: newStatus,
        subtasks: updatedSubtasks
      });
    } catch (err) {
      
      setTasks(originalTasks);
      addToast(err.message || 'Failed to update status on server.', 'error');
    }
  };

  const handleDeleteTask = async (id) => {
    const originalTasks = [...tasks];

    
    setTasks(tasks.filter(t => t._id !== id));
    addToast('Task removed from workspace.', 'error');

    try {
      
      await taskApi.deleteTask(id);
    } catch (err) {
      
      setTasks(originalTasks);
      addToast(err.message || 'Failed to delete task from server.', 'error');
    }
  };

  const handleSubtaskToggle = async (taskId, subtaskId, isCompleted) => {
    const originalTasks = [...tasks];
    
    
    const updatedTasks = tasks.map(t => {
      if (t._id === taskId) {
        const subList = Array.isArray(t.subtasks) ? t.subtasks : [];
        const updatedSubtasks = subList.map(st => 
          st._id === subtaskId ? { ...st, isCompleted } : st
        );
        
        
        
        const allCompleted = updatedSubtasks.every(st => st.isCompleted);
        let nextStatus = t.status;
        if (allCompleted) {
          nextStatus = 'completed';
        } else if (t.status === 'completed') {
          nextStatus = 'in-progress';
        }
        
        return { ...t, subtasks: updatedSubtasks, status: nextStatus };
      }
      return t;
    });
    setTasks(updatedTasks);

    try {
      const targetTask = updatedTasks.find(t => t._id === taskId);
      await taskApi.updateTask(taskId, { 
        subtasks: targetTask.subtasks,
        status: targetTask.status
      });
    } catch (err) {
      
      setTasks(originalTasks);
      addToast(err.message || 'Failed to update subtask status.', 'error');
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleAddTaskClick = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (taskData) => {
    try {
      if (editingTask) {
        
        const response = await taskApi.updateTask(editingTask._id, taskData);
        if (response.success) {
          setTasks(tasks.map(t => t._id === editingTask._id ? response.data : t));
          addToast('Task changes updated successfully.');
        }
      } else {
        
        const response = await taskApi.createTask(taskData);
        if (response.success) {
          setTasks([response.data, ...tasks]);
          addToast('New task added successfully.');
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      addToast(err.message || 'Failed to save changes.', 'error');
    }
  };

  
  const getPriorityWeight = (priority) => {
    if (priority === 'high') return 3;
    if (priority === 'medium') return 2;
    return 1;
  };

  
  const getFilteredAndSortedTasks = () => {
    let result = [...tasks];

    
    if (activeFilter === 'pending') {
      result = result.filter(t => t.status !== 'completed');
    } else if (activeFilter === 'completed') {
      result = result.filter(t => t.status === 'completed');
    } else if (activeFilter === 'high') {
      result = result.filter(t => t.priority === 'high');
    } else if (activeFilter === 'overdue') {
      result = result.filter(t => {
        if (!t.dueDate || t.status === 'completed') return false;
        return new Date() > new Date(t.dueDate);
      });
    }

    
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) || 
        (t.description && t.description.toLowerCase().includes(q))
      );
    }

    
    if (priorityFilter !== 'all') {
      result = result.filter(t => t.priority === priorityFilter);
    }

    
    result.sort((a, b) => {
      let valA, valB;
      const orderMultiplier = sortOrder === 'asc' ? 1 : -1;

      if (sortBy === 'priority') {
        valA = getPriorityWeight(a.priority);
        valB = getPriorityWeight(b.priority);
      } else if (sortBy === 'dueDate') {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1; 
        if (!b.dueDate) return -1;
        valA = new Date(a.dueDate).getTime();
        valB = new Date(b.dueDate).getTime();
      } else {
        
        valA = new Date(a.createdAt || 0).getTime();
        valB = new Date(b.createdAt || 0).getTime();
      }

      if (valA < valB) return -1 * orderMultiplier;
      if (valA > valB) return 1 * orderMultiplier;
      return 0;
    });

    return result;
  };

  const visibleTasks = getFilteredAndSortedTasks();

  return (
    <>
      <div className="noise-overlay"></div>
      <div className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        
        <Sidebar 
          activeFilter={activeFilter} 
          setActiveFilter={setActiveFilter}
          stats={getSidebarStats()}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />

        
        <main className="dashboard-main">
          
          <Header 
            onAddTaskClick={handleAddTaskClick} 
            taskCount={visibleTasks.filter(t => t.status !== 'completed').length}
          />

          
          <section className="obsidian-panel controls-bar">
            <div className="search-box">
              <Search size={16} strokeWidth={1.8} />
              <input 
                type="text" 
                placeholder="Search tasks, descriptions, or tags..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-selects">
              
              <div className="select-wrapper">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  title="Filter by priority"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              
              <div className="select-wrapper">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  title="Sort by field"
                >
                  <option value="createdAt">Date Created</option>
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority Weight</option>
                </select>
              </div>

              
              <div className="select-wrapper">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  title="Sort order"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </section>

          
          <section className="tasks-grid">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="skeleton-card">
                  <div className="skeleton-shimmer"></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '70%' }}>
                      <div className="skeleton-block" style={{ width: '18px', height: '18px', borderRadius: '4px' }}></div>
                      <div className="skeleton-block" style={{ width: '80%', height: '16px' }}></div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <div className="skeleton-block" style={{ width: '20px', height: '20px', borderRadius: '4px' }}></div>
                      <div className="skeleton-block" style={{ width: '20px', height: '20px', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                    <div className="skeleton-block" style={{ width: '90%', height: '12px' }}></div>
                    <div className="skeleton-block" style={{ width: '80%', height: '12px' }}></div>
                    <div className="skeleton-block" style={{ width: '40%', height: '12px' }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                    <div className="skeleton-block" style={{ width: '80px', height: '12px' }}></div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <div className="skeleton-block" style={{ width: '40px', height: '16px', borderRadius: '4px' }}></div>
                      <div className="skeleton-block" style={{ width: '40px', height: '16px', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                </div>
              ))
            ) : visibleTasks.length > 0 ? (
              visibleTasks.map((task) => (
                <TaskCard 
                  key={task._id} 
                  task={task} 
                  onToggleStatus={handleToggleStatus}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteTask}
                  onSubtaskToggle={handleSubtaskToggle}
                />
              ))
            ) : (
              <div className="obsidian-panel empty-state">
                <div className="empty-icon">
                  <Inbox size={32} strokeWidth={1.8} />
                </div>
                <h3 className="empty-title">No records matched</h3>
                <p className="empty-desc">
                  We couldn't find any tasks matching your filters. Try adjusting your query or launch a new task!
                </p>
              </div>
            )}
          </section>

          {/* Legal and compliance footer */}
          <footer className="dashboard-footer">
            <span>© {new Date().getFullYear()} Task Tracker Workspace. All rights reserved.</span>
            <div className="footer-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
            </div>
          </footer>
        </main>

      {/* Task Creation & Editing Modal Dialog */}
      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        task={editingTask}
      />

      {/* Custom float Toast manager */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast 
            key={toast.id} 
            toast={toast} 
            onDismiss={removeToast} 
          />
        ))}
      </div>
    </div>
    </>
  );
}

export default App;
