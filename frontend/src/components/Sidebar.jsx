import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

const Sidebar = ({ activeFilter, setActiveFilter, stats, isCollapsed, setIsCollapsed }) => {
  const { total = 0, completed = 0, pending = 0, highPriority = 0, overdue = 0, completionRate = 0 } = stats;
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  const menuItems = [
    { id: 'all',       label: 'All Tasks',     icon: LayoutDashboard, count: total },
    { id: 'pending',   label: 'In Progress',   icon: Clock,           count: pending },
    { id: 'completed', label: 'Completed',     icon: CheckCircle,     count: completed },
    { id: 'high',      label: 'High Priority', icon: AlertTriangle,   count: highPriority },
    { id: 'overdue',   label: 'Overdue',       icon: AlertTriangle,   count: overdue, color: '#ef4444' }
  ];

  const handleMobileNav = (id) => {
    setActiveFilter(id);
    setIsMobileDrawerOpen(false);
  };

  /* ── Progress Ring ────────────────────────────── */
  const ProgressRing = () => (
    <div className="stats-card">
      <div className="stats-progress-ring">
        <svg width="72" height="72">
          <defs>
            <linearGradient id="gold-champagne-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e5a93b" />
              <stop offset="100%" stopColor="#b87b14" />
            </linearGradient>
          </defs>
          <circle className="ring-bg" cx="36" cy="36" r={radius} />
          <circle
            className="ring-fill"
            cx="36" cy="36" r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="stats-progress-text num-data">{completionRate}%</div>
      </div>
      <span className="stats-label">Productivity Index</span>
      <span className="stats-sub num-data">{completed}/{total} tasks complete</span>
    </div>
  );

  return (
    <>
      {/* ══════════════════════════════════════════
          MOBILE: Fixed top bar with brand + bottom nav
          ══════════════════════════════════════════ */}
      <div className="mobile-topbar obsidian-panel">
        {/* Brand logo — tapping opens drawer */}
        <button
          className="mobile-brand-btn"
          onClick={() => setIsMobileDrawerOpen(true)}
          aria-label="Open navigation menu"
        >
          <div className="brand-logo">
            <CheckSquare size={20} color="#09090b" strokeWidth={2.2} />
          </div>
          <span className="mobile-brand-name">Task Tracker</span>
        </button>

        {/* Productivity ring — percentage centered inside ring via SVG text */}
        <div className="mobile-productivity-badge">
          <svg width="44" height="44" viewBox="0 0 44 44">
            <defs>
              <linearGradient id="mob-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e5a93b" />
                <stop offset="100%" stopColor="#b87b14" />
              </linearGradient>
            </defs>
            {/* Track */}
            <circle cx="22" cy="22" r="17" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3.5" />
            {/* Progress arc */}
            <circle
              cx="22" cy="22" r="17"
              fill="none"
              stroke="url(#mob-gold-grad)"
              strokeWidth="3.5"
              strokeDasharray={2 * Math.PI * 17}
              strokeDashoffset={2 * Math.PI * 17 - (completionRate / 100) * 2 * Math.PI * 17}
              strokeLinecap="round"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '22px 22px' }}
            />
            {/* Centered percentage label */}
            <text
              x="22" y="22"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#e5a93b"
              fontSize="9"
              fontWeight="700"
              fontFamily="Inter, sans-serif"
              letterSpacing="-0.3"
            >
              {completionRate}%
            </text>
          </svg>
        </div>
      </div>

      {/* ── Mobile Bottom Nav ──────────────────── */}
      <nav className="mobile-bottom-nav obsidian-panel">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeFilter === item.id;
          return (
            <button
              key={item.id}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveFilter(item.id)}
              title={item.label}
            >
              <Icon
                size={22}
                strokeWidth={2.2}
                style={item.color && !isActive ? { color: item.color } : {}}
              />
              {item.count > 0 && (
                <span className="mobile-nav-badge num-data">{item.count}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Mobile Drawer Overlay ─────────────── */}
      {isMobileDrawerOpen && (
        <div
          className="mobile-drawer-overlay"
          onClick={() => setIsMobileDrawerOpen(false)}
        />
      )}

      {/* ── Mobile Drawer Panel ───────────────── */}
      <div className={`mobile-drawer obsidian-panel ${isMobileDrawerOpen ? 'open' : ''}`}>
        {/* Drawer header */}
        <div className="mobile-drawer-header">
          <div className="brand">
            <div className="brand-logo">
              <CheckSquare size={22} color="#09090b" strokeWidth={2.2} />
            </div>
            <span className="brand-name">Task Tracker</span>
          </div>
          <button
            className="sidebar-toggle-btn"
            onClick={() => setIsMobileDrawerOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer nav items */}
        <nav className="mobile-drawer-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeFilter === item.id;
            return (
              <button
                key={item.id}
                className={`menu-item ${isActive ? 'active' : ''}`}
                onClick={() => handleMobileNav(item.id)}
              >
                <Icon size={20} strokeWidth={2.2} style={item.color && !isActive ? { color: item.color } : {}} />
                <span>{item.label}</span>
                <span className="num-data" style={{ marginLeft: 'auto', fontSize: '0.78rem', opacity: 0.55, fontWeight: 600 }}>
                  {item.count}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Productivity ring in drawer */}
        <ProgressRing />
      </div>

      {/* ══════════════════════════════════════════
          DESKTOP: Traditional collapsible sidebar
          ══════════════════════════════════════════ */}
      <aside className="obsidian-panel sidebar desktop-sidebar">
        <div>
          <div className="sidebar-header-section">
            <div className="brand">
              <div className="brand-logo">
                <CheckSquare size={24} color="#09090b" strokeWidth={2.2} />
              </div>
              <span className="brand-name">Task Tracker</span>
            </div>
            <button
              className="sidebar-toggle-btn"
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? 'Expand Sidebar (Ctrl+B)' : 'Collapse Sidebar (Ctrl+B)'}
              type="button"
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          <nav className="menu-section">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeFilter === item.id;
              return (
                <button
                  key={item.id}
                  className={`menu-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveFilter(item.id)}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon size={20} strokeWidth={2.2} style={item.color && !isActive ? { color: item.color } : {}} />
                  <span>{item.label}</span>
                  {!isCollapsed && (
                    <span
                      className="num-data"
                      style={{ marginLeft: 'auto', fontSize: '0.78rem', opacity: 0.5, fontWeight: 600 }}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {!isCollapsed && <ProgressRing />}
      </aside>
    </>
  );
};

export default Sidebar;
