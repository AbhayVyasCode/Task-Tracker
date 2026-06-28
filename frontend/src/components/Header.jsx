import React from 'react';
import { Plus } from 'lucide-react';

const Header = ({ onAddTaskClick, taskCount }) => {
  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="obsidian-panel dashboard-header">
      <div className="header-title-section">
        <h1>{getGreeting()}, Abhay</h1>
        <p>
          {taskCount === 0 
            ? 'No tasks remaining. Enjoy your empty workspace!' 
            : `You have ${taskCount} active task${taskCount > 1 ? 's' : ''} to focus on today.`
          }
        </p>
      </div>

      <div className="header-actions">
        <button className="btn-primary" onClick={onAddTaskClick}>
          <Plus size={16} strokeWidth={1.8} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
