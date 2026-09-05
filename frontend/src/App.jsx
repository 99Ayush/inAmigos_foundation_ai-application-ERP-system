import React, { useState, useEffect } from 'react';
import Auth from './pages/Auth';
import Layout from './components/Layout';
import AnalyticsBar from './components/AnalyticsBar';
import HighDensityTable from './components/HighDensityTable';
import KanbanBoard from './components/KanbanBoard';
import RunningInitiativesMonitor from './components/RunningInitiativesMonitor';
import CorporateFundingPanel from './components/CorporateFundingPanel';
import ApplicantsDirectoryView from './pages/ApplicantsDirectoryView';
import ApplicationDetailsView from './pages/ApplicationDetailsView';
import InitiativeDetailsView from './pages/InitiativeDetailsView';
import CSRProposalDetailsView from './pages/CSRProposalDetailsView';
import AnalyticsVisualsView from './pages/AnalyticsVisualsView';
import AuditTrailView from './pages/AuditTrailView';
import VolunteerPortalView from './pages/VolunteerPortalView';
import { API_BASE_URL } from './services/api';

import { mockApplications, mockCorporateProposals, mockAuditLogs } from './data/mockData';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('inamigos_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentView, setCurrentView] = useState('admin');
  const [applications, setApplications] = useState(mockApplications);
  const [corporateProposals, setCorporateProposals] = useState(mockCorporateProposals);
  const [auditLogs, setAuditLogs] = useState(mockAuditLogs);
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedInitiative, setSelectedInitiative] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [apiConnected, setApiConnected] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'PARTNER';

  const fetchData = async () => {
    try {
      const [appRes, csrRes, auditRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/admin/applications?limit=50`),
        fetch(`${API_BASE_URL}/api/v1/admin/csr-proposals`),
        fetch(`${API_BASE_URL}/api/v1/admin/audit-logs`)
      ]);

      if (appRes.ok) {
        const json = await appRes.json();
        if (json.data && json.data.length > 0) {
          setApplications(json.data);
        } else {
          setApplications(mockApplications);
        }
      }
      
      if (csrRes.ok) {
        const json = await csrRes.json();
        if (json.data && json.data.length > 0) {
          setCorporateProposals(json.data);
        } else {
          setCorporateProposals(mockCorporateProposals);
        }
      }
      
      if (auditRes.ok) {
        const json = await auditRes.json();
        if (json.data && json.data.length > 0) {
          setAuditLogs(json.data);
        } else {
          setAuditLogs(mockAuditLogs);
        }
      }
      
      setApiConnected(true);
    } catch (e) {
      setApiConnected(false);
      setApplications(mockApplications);
      setCorporateProposals(mockCorporateProposals);
      setAuditLogs(mockAuditLogs);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('inamigos_user', JSON.stringify(user));
      if (user.role === 'VOLUNTEER') {
        setCurrentView('volunteer');
      } else {
        if (currentView === 'volunteer') {
          setCurrentView('admin');
        }
      }
    } else {
      localStorage.removeItem('inamigos_user');
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    setSelectedApp(null);
    setSelectedInitiative(null);
    setSelectedProposal(null);
    localStorage.removeItem('inamigos_user');
  };

  const addAuditLog = async (action, target, details, category) => {
    const newLog = {
      actorName: user?.name || 'Admin TPO',
      actorRole: user?.role || 'Super Admin',
      action,
      target,
      details,
      category
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/audit-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog)
      });
      if (res.ok) {
        const fetchRes = await fetch(`${API_BASE_URL}/api/v1/admin/audit-logs`);
        if (fetchRes.ok) {
          const json = await fetchRes.json();
          setAuditLogs(json.data || []);
        }
      }
    } catch (e) {}
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    setApplications((prev) =>
      prev.map((app) => {
        const id = app.APPLICATION_ID || app.application_id;
        if (id === appId) {
          return { ...app, STATUS: newStatus, status: newStatus };
        }
        return app;
      })
    );

    if (selectedApp && (selectedApp.APPLICATION_ID || selectedApp.application_id) === appId) {
      setSelectedApp((prev) => ({ ...prev, STATUS: newStatus, status: newStatus }));
    }

    addAuditLog(
      `Candidate Status -> ${newStatus}`,
      `App #${appId}`,
      `Admin transitioned candidate application to ${newStatus}.`,
      'TRIAGE_DECISION'
    );

    try {
      await fetch(`${API_BASE_URL}/api/v1/admin/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {}
  };

  const handleBulkApprove = (appIds) => {
    setApplications((prev) =>
      prev.map((app) => {
        const id = app.APPLICATION_ID || app.application_id;
        if (appIds.includes(id)) {
          return { ...app, STATUS: 'accepted', status: 'accepted' };
        }
        return app;
      })
    );

    addAuditLog(
      'Bulk Candidate Acceptance',
      `${appIds.length} Applicants`,
      `Admin bulk approved ${appIds.length} candidates in one transaction.`,
      'TRIAGE_DECISION'
    );

    appIds.forEach(async (id) => {
      try {
        await fetch(`${API_BASE_URL}/api/v1/admin/applications/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'accepted' })
        });
      } catch (e) {}
    });
  };

  const handleAcceptProposal = async (proposalId) => {
    const prop = corporateProposals.find((p) => p.id === proposalId);
    setCorporateProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? { ...p, status: 'Approved' } : p))
    );

    addAuditLog(
      'CSR Grant Formal Approval',
      prop?.companyName || `Grant #${proposalId}`,
      `Sanctioned ₹${((prop?.pledgedAmount || 500000) / 100000).toFixed(1)}L CSR capital for ${prop?.targetedInitiative}.`,
      'CSR_GRANT'
    );

    try {
      await fetch(`${API_BASE_URL}/api/v1/admin/csr-proposals/${proposalId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approved' })
      });
    } catch (e) {}
  };

  const handleRejectProposal = async (proposalId) => {
    const prop = corporateProposals.find((p) => p.id === proposalId);
    setCorporateProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? { ...p, status: 'Rejected' } : p))
    );

    addAuditLog(
      'CSR Grant Declined',
      prop?.companyName || `Grant #${proposalId}`,
      `Formal decline issued for grant proposal ${proposalId}.`,
      'CSR_GRANT'
    );

    try {
      await fetch(`${API_BASE_URL}/api/v1/admin/csr-proposals/${proposalId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Rejected' })
      });
    } catch (e) {}
  };

  const handleFormSubmitSuccess = () => {
    fetchData();
    setTimeout(() => {
      if (user && user.role === 'VOLUNTEER') {
        setCurrentView('volunteer');
      } else {
        setCurrentView('applicants');
      }
    }, 1000);
  };

  const handleOpenApplicationDetails = (app) => {
    setSelectedApp(app);
    setCurrentView('app_details');
  };

  const handleOpenInitiativeDetails = (init) => {
    setSelectedInitiative(init);
    setCurrentView('init_details');
  };

  const handleOpenProposalDetails = (prop) => {
    setSelectedProposal(prop);
    setCurrentView('prop_details');
  };

  if (!user) {
    return <Auth onLogin={(loggedInUser) => setUser(loggedInUser)} />;
  }

  return (
    <Layout
      currentView={currentView}
      setCurrentView={setCurrentView}
      user={user}
      onLogout={handleLogout}
      apiConnected={apiConnected}
      onSearch={setGlobalSearch}
    >
      {/* ─── 1. FULL-PAGE APPLICATION DOSSIER ─── */}
      {currentView === 'app_details' && selectedApp && (
        <ApplicationDetailsView
          application={selectedApp}
          onBack={() => setCurrentView('admin')}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      {/* ─── 2. FULL-PAGE INITIATIVE OPERATIONAL DOSSIER ─── */}
      {currentView === 'init_details' && selectedInitiative && (
        <InitiativeDetailsView
          initiative={selectedInitiative}
          onBack={() => setCurrentView('initiatives')}
        />
      )}

      {/* ─── 3. FULL-PAGE CSR FINANCIAL GRANT DOSSIER ─── */}
      {currentView === 'prop_details' && selectedProposal && (
        <CSRProposalDetailsView
          proposal={selectedProposal}
          onBack={() => setCurrentView('funding')}
          onAccept={handleAcceptProposal}
          onReject={handleRejectProposal}
        />
      )}

      {/* ─── 4. EXECUTIVE ADMIN DASHBOARD ─── */}
      {currentView === 'admin' && (
        <>
          <AnalyticsBar
            applications={applications}
            corporateProposals={corporateProposals}
            onTileClick={(viewTarget) => setCurrentView(viewTarget)}
          />

          <div className="dashboard-grid">
            <div className="dashboard-left-col">
              <HighDensityTable
                applications={applications}
                onRowClick={handleOpenApplicationDetails}
                onStatusChange={handleStatusUpdate}
                globalSearch={globalSearch}
                onBulkApprove={handleBulkApprove}
              />
            </div>

            <div className="dashboard-right-col">
              <RunningInitiativesMonitor
                maxItems={2}
                onViewFullDirectory={() => setCurrentView('initiatives')}
                onSelectInitiative={handleOpenInitiativeDetails}
                isAdmin={isAdmin}
              />

              <CorporateFundingPanel
                proposals={corporateProposals}
                maxItems={2}
                onAcceptProposal={handleAcceptProposal}
                onRejectProposal={handleRejectProposal}
                onViewAllFunding={() => setCurrentView('funding')}
                onSelectProposal={handleOpenProposalDetails}
                isAdmin={isAdmin}
              />
            </div>
          </div>
        </>
      )}

      {/* ─── 5. VISUAL CHARTS & ANALYTICS VIEW ─── */}
      {currentView === 'visuals' && (
        <AnalyticsVisualsView
          applications={applications}
          corporateProposals={corporateProposals}
          onBackToDashboard={() => setCurrentView('admin')}
        />
      )}

      {/* ─── 6. APPLICANTS DIRECTORY VIEW ─── */}
      {currentView === 'applicants' && (
        <ApplicantsDirectoryView
          applications={applications}
          onSelectApplication={handleOpenApplicationDetails}
        />
      )}

      {/* ─── 7. RUNNING INITIATIVES TAB ─── */}
      {currentView === 'initiatives' && (
        <RunningInitiativesMonitor
          maxItems={null}
          onViewFullDirectory={() => {}}
          onSelectInitiative={handleOpenInitiativeDetails}
          isAdmin={isAdmin}
        />
      )}

      {/* ─── 8. CSR FUNDING PIPELINE TAB ─── */}
      {currentView === 'funding' && (
        <CorporateFundingPanel
          proposals={corporateProposals}
          maxItems={null}
          onAcceptProposal={handleAcceptProposal}
          onRejectProposal={handleRejectProposal}
          onSelectProposal={handleOpenProposalDetails}
          isAdmin={isAdmin}
        />
      )}

      {/* ─── 9. TRIAGE PIPELINE BOARD TAB ─── */}
      {currentView === 'kanban' && (
        <KanbanBoard
          applications={applications}
          onCardClick={handleOpenApplicationDetails}
        />
      )}

      {/* ─── 10. STATUTORY AUDIT TRAIL & CSR COMPLIANCE LOGS ─── */}
      {currentView === 'audit' && (
        <AuditTrailView auditLogs={auditLogs} />
      )}

      {/* ─── 11. VOLUNTEER PORTAL ─── */}
      {currentView === 'volunteer' && (
        <VolunteerPortalView
          applications={applications}
          onSubmitSuccess={handleFormSubmitSuccess}
        />
      )}
    </Layout>
  );
}
