import React from 'react';
import './Sidebar.css';

const NAV_ITEMS = [
  { view: 'admin',       icon: '⊞', label: 'Dashboard',             adminOnly: true,  volunteerOnly: false },
  { view: 'applicants',  icon: '👥', label: 'Applicants Directory',  adminOnly: true,  volunteerOnly: false },
  { view: 'initiatives', icon: '◈', label: 'Running Initiatives',   adminOnly: false, volunteerOnly: false },
  { view: 'funding',     icon: '💼', label: 'CSR Funding Pipeline',  adminOnly: true,  volunteerOnly: false },
  { view: 'kanban',      icon: '☰', label: 'Triage Pipeline Board', adminOnly: true,  volunteerOnly: false },
  { view: 'audit',       icon: '📜', label: 'Audit Trail & Logs',    adminOnly: true,  volunteerOnly: false },
  { view: 'volunteer',   icon: '✎', label: 'Volunteer Portal',      adminOnly: false, volunteerOnly: true  },
];

export default function Sidebar({
  currentView,
  setCurrentView,
  user,
  onLogout,
  apiConnected,
  onOpenSettings,
  onHoverChange
}) {
  const role = user?.role || 'ADMIN';
  const isAdmin = role === 'ADMIN' || role === 'PARTNER';

  return (
    <aside
      className="sidebar-container"
      title="Hover to expand tray"
      onMouseEnter={() => onHoverChange && onHoverChange(true)}
      onMouseLeave={() => onHoverChange && onHoverChange(false)}
    >
      {/* Official InAmigos Foundation Logo Header */}
      <div className="sidebar-brand-wrap">
        <div className="sidebar-logo-img-box">
          <img
            src="/inamigos_logo.png"
            alt="InAmigos Foundation Logo"
            className="official-logo-img"
          />
        </div>
        <div className="sidebar-brand-text">
          <span className="brand-title">InAmigos®</span>
          <span className="brand-sub">FOUNDATION</span>
          <span className="brand-motto">Uniting Minds for Change</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          if (item.volunteerOnly && isAdmin) return null;
          if (item.adminOnly && !isAdmin) return null;

          const isActive = currentView === item.view;

          return (
            <button
              key={item.view}
              className={`sidebar-item${isActive ? ' active' : ''}`}
              onClick={() => setCurrentView(item.view)}
              title={item.label}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              <span className="sidebar-item-label">{item.label}</span>
            </button>
          );
        })}

        <div className="sidebar-divider" />

        {/* Configure Settings Button */}
        <button
          className="sidebar-item"
          onClick={onOpenSettings}
          title="Configure Settings"
        >
          <span className="sidebar-item-icon">⚙</span>
          <span className="sidebar-item-label">Configure Settings</span>
        </button>
      </nav>

      {/* Footer: Open Door Logout Control */}
      <div className="sidebar-footer">
        <button
          className="sidebar-logout-btn"
          onClick={onLogout}
          title="Logout of InAmigos ERP"
        >
          <span className="logout-icon">🚪</span>
          <span className="logout-label">Logout</span>
        </button>
      </div>
    </aside>
  );
}
