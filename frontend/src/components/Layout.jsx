import React, { useState } from 'react';
import Sidebar from './Sidebar';
import SettingsModal from './SettingsModal';
import './Layout.css';

const VIEW_META = {
  admin: {
    greeting: 'Admin Operations & Triage Dashboard',
    sub: 'Real-time volunteer pipeline, AI evaluations, and running initiatives management.'
  },
  visuals: {
    greeting: 'Operational Analytics & Visual Charts',
    sub: 'Visual metrics, volunteer distribution graphs, and CSR capital utilization.'
  },
  applicants: {
    greeting: 'Volunteer Candidates Directory',
    sub: 'Review candidate dossiers, extracted skills, and Gemini AI initiative matches.'
  },
  initiatives: {
    greeting: 'InAmigos Core Running Initiatives',
    sub: 'Live operational metrics, project goals, and volunteer deployments.'
  },
  funding: {
    greeting: 'Corporate CSR Funding Pipeline',
    sub: 'Institutional grants, financial compliance, and corporate sponsorship proposals.'
  },
  kanban: {
    greeting: 'Volunteer Triage Pipeline Board',
    sub: 'Candidate stages from raw application to project onboarding.'
  },
  volunteer: {
    greeting: 'Volunteer Portal',
    sub: 'Submit your profile and track active placement status across initiatives.'
  }
};

export default function Layout({
  currentView,
  setCurrentView,
  user,
  onLogout,
  apiConnected,
  children,
  onSearch
}) {
  const [searchVal, setSearchVal] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const meta = VIEW_META[currentView] || VIEW_META.admin;
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleSearch = (e) => {
    setSearchVal(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <div className="app-layout">
      {/* ─── Left Icon Sidebar (Hover Expandable Tray) ─── */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={user}
        onLogout={onLogout}
        apiConnected={apiConnected}
        onOpenSettings={() => setSettingsOpen(true)}
        onHoverChange={(hovered) => setIsSidebarHovered(hovered)}
      />

      <div
        className="main-wrapper"
        style={{ marginLeft: isSidebarHovered ? '240px' : '60px' }}
      >
        {/* ─── Top Header ─── */}
        <header className="main-header">
          <div className="header-search-wrap">
            <span className="header-search-icon">🔍</span>
            <input
              type="text"
              className="header-search-input"
              placeholder="Search applicants, initiatives, corporate sponsors..."
              value={searchVal}
              onChange={handleSearch}
            />
          </div>

          <div className="header-right">
            {/* Visuals / Analytics View Toggle */}
            <button
              className="header-icon-btn"
              title={currentView === 'visuals' ? 'Return to Dashboard' : 'View Visual Charts & Analytics'}
              onClick={() => setCurrentView(currentView === 'visuals' ? 'admin' : 'visuals')}
              style={{
                background: currentView === 'visuals' ? '#0f172a' : '#ffffff',
                color: currentView === 'visuals' ? '#ffffff' : '#64748b'
              }}
            >
              📊
            </button>

            {/* Direct Logout Button */}
            <button
              className="header-icon-btn"
              title="Logout of InAmigos ERP"
              onClick={onLogout}
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#ef4444',
                borderColor: '#fecdd3',
                background: '#fff1f2',
                width: 'auto',
                padding: '0 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              🚪 Logout
            </button>
          </div>
        </header>

        {/* ─── Scrollable Content ─── */}
        <div className="scrollable-content">
          {/* Dynamic Header / Welcome Banner */}
          {currentView === 'admin' ? (
            <div className="welcome-section">
              <div className="welcome-text">
                <h2>Welcome back, {user?.name?.split(' ')[0] || 'Admin'} 👋</h2>
                <p>{dateStr}</p>
              </div>
            </div>
          ) : (
            <div className="breadcrumb-section" style={{ padding: '24px 32px 0 32px', marginBottom: '-8px' }}>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
                Dashboard / <span style={{ color: '#0f172a' }}>{meta.greeting}</span>
              </div>
            </div>
          )}

          {/* Page Content */}
          {children}
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
