import React, { useState } from 'react';
import './HighDensityTable.css';

const PRIORITY_MAP = {
  'Project Bachpanshala': 'High',
  'Project Jeev':         'Medium',
  'Project Seva':         'Urgent',
  'Project Prakriti':     'Medium',
  'Project Udaan':        'High',
  'General Operations':   'Low',
};

export default function HighDensityTable({
  applications = [],
  onRowClick,
  onStatusChange,
  globalSearch = '',
  onBulkApprove = null
}) {
  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const limit = 5;

  const search = globalSearch || localSearch;

  // Real-time Filtering
  const filteredApps = applications.filter((app) => {
    const name = app.FULL_NAME || app.full_name || '';
    const email = app.EMAIL || app.email || '';
    const skills = app.SKILLS || app.skills || '';
    const statement = app.RAW_STATEMENT || app.raw_statement || '';
    const status = app.STATUS || app.status || 'Pending';
    const initiative = app.INITIATIVE_TITLE || app.initiative_title || app.ai_suggested_initiative || '';

    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      name.toLowerCase().includes(q) ||
      email.toLowerCase().includes(q) ||
      skills.toLowerCase().includes(q) ||
      statement.toLowerCase().includes(q) ||
      initiative.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'ALL' || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredApps.length / limit) || 1;
  const pagedApps = filteredApps.slice((page - 1) * limit, page * limit);

  // Dynamic Count for Needs Review queue size
  const pendingReviewCount = applications.filter((a) => {
    const s = a.STATUS || a.status || '';
    return s === 'submitted' || s === 'manual_review';
  }).length;

  // Distinct Status System: Pill Badges
  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return <span className="status-pill accepted">Accepted</span>;
      case 'rejected':
        return <span className="status-pill rejected">Rejected</span>;
      case 'ai_triaged':
        return <span className="status-pill ai_triaged">AI Triaged</span>;
      case 'manual_review':
        return <span className="status-pill in_review">Manual Review</span>;
      case 'submitted':
      default:
        return <span className="status-pill manual_review">Submitted</span>;
    }
  };

  // Distinct Priority System: Dot Indicator + Text
  const getPriorityIndicator = (initiative) => {
    const p = PRIORITY_MAP[initiative] || 'Medium';
    const dotClass = p.toLowerCase();
    return (
      <div className="priority-dot-indicator">
        <span className={`priority-dot ${dotClass}`} />
        <span>{p}</span>
      </div>
    );
  };

  // AI Confidence Color Thresholds: >=90% Green, 70-89% Amber Alert, <70% Red Alert
  const getConfidenceLevel = (pct) => {
    if (pct >= 90) return 'high';
    if (pct >= 70) return 'medium';
    return 'low';
  };

  // Bulk Selection Handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = pagedApps.map((a) => a.APPLICATION_ID || a.application_id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkApproveClick = () => {
    if (onBulkApprove) {
      onBulkApprove(selectedIds);
    } else {
      selectedIds.forEach((id) => onStatusChange(id, 'accepted'));
    }
    setSelectedIds([]);
  };

  return (
    <div className="table-card">
      {/* Toolbar */}
      <div className="table-toolbar">
        <div className="table-title-area">
          <h3>Volunteer Pipeline Queue</h3>
          <p>Real-time candidate submissions & AI triage status</p>
        </div>

        <div className="toolbar-right">
          {!globalSearch && (
            <div className="toolbar-search">
              <span className="search-icon-inner">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search candidate..."
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          )}

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="ALL">All Applications ({applications.length})</option>
            <option value="submitted">Submitted</option>
            <option value="ai_triaged">AI Triaged</option>
            <option value="manual_review">Needs Review</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Filter Queue Button with Live Counter Badge */}
          <button
            className={`btn-needs-review-toggle ${statusFilter === 'manual_review' ? 'active' : ''}`}
            onClick={() => {
              setStatusFilter(
                statusFilter === 'manual_review' ? 'ALL' : 'manual_review'
              );
              setPage(1);
            }}
          >
            <span>⚡ Needs Review</span>
            <span className="review-count-badge">{pendingReviewCount}</span>
          </button>
        </div>
      </div>

      {/* Bulk Action Bar (Appears when items are checked) */}
      {selectedIds.length > 0 && (
        <div className="bulk-actions-bar">
          <span>{selectedIds.length} candidate(s) selected</span>
          <div className="bulk-btn-group">
            <button className="btn-bulk-action" onClick={handleBulkApproveClick}>
              ✓ Bulk Approve Selected
            </button>
            <button className="btn-bulk-cancel" onClick={() => setSelectedIds([])}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Responsive Table */}
      <div className="table-wrapper">
        <table className="dense-table">
          <thead>
            <tr>
              <th style={{ width: '32px' }}>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={pagedApps.length > 0 && selectedIds.length === pagedApps.length}
                />
              </th>
              <th>Applicant Profile</th>
              <th>Status</th>
              <th>AI Confidence</th>
              <th>Assigned Initiative</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedApps.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  No candidate applications match your current query or filter.
                </td>
              </tr>
            ) : (
              pagedApps.map((app) => {
                const appId = app.APPLICATION_ID || app.application_id;
                const name = app.FULL_NAME || app.full_name || 'Anonymous';
                const email = app.EMAIL || app.email || '';
                const initiative =
                  app.INITIATIVE_TITLE ||
                  app.initiative_title ||
                  app.AI_SUGGESTED_INITIATIVE ||
                  app.ai_suggested_initiative ||
                  'General Operations';
                const rawConf =
                  app.AI_CONFIDENCE !== undefined
                    ? Number(app.AI_CONFIDENCE)
                    : Number(app.ai_confidence || 0.85);
                const confidencePct = Math.round(rawConf * 100);
                const status = app.STATUS || app.status || 'Pending';
                const confLevel = getConfidenceLevel(confidencePct);
                const isSelected = selectedIds.includes(appId);

                return (
                  <tr key={appId} onClick={() => onRowClick && onRowClick(app)}>
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(appId)}
                      />
                    </td>
                    <td>
                      <div className="applicant-info">
                        <span className="applicant-name">{name}</span>
                        <span className="applicant-sub">{email}</span>
                      </div>
                    </td>
                    <td>{getStatusBadge(status)}</td>
                    <td>
                      <div className="confidence-cell">
                        <div className="progress-bar-bg">
                          <div
                            className={`progress-bar-fill ${confLevel}`}
                            style={{ width: `${confidencePct}%` }}
                          />
                        </div>
                        <span className={`confidence-text ${confLevel}`}>
                          {confidencePct}%
                        </span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, fontSize: '12px' }}>{initiative}</td>
                    <td>{getPriorityIndicator(initiative)}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="action-cell-wrap">
                        {/* Row-Level Quick Actions on Hover */}
                        <div className="row-quick-actions">
                          <button
                            className="btn-quick-icon accept"
                            title="Quick Accept"
                            onClick={() => onStatusChange(appId, 'accepted')}
                          >
                            ✓
                          </button>
                          <button
                            className="btn-quick-icon review"
                            title="Move to Review"
                            onClick={() => onStatusChange(appId, 'manual_review')}
                          >
                            👁
                          </button>
                          <button
                            className="btn-quick-icon reject"
                            title="Reject"
                            onClick={() => onStatusChange(appId, 'rejected')}
                          >
                            ✕
                          </button>
                        </div>

                        <button
                          className="btn-action-open"
                          onClick={() => onRowClick && onRowClick(app)}
                        >
                          Open →
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (Hidden if only 1 page to avoid dead UI) */}
      {totalPages > 1 && (
        <div className="table-pagination">
          <span>
            Showing <strong>{pagedApps.length}</strong> of <strong>{filteredApps.length}</strong> applicants
          </span>
          <div className="pagination-controls">
            <button className="btn-page" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              ←
            </button>
            <span className="page-info">
              {page} / {totalPages}
            </span>
            <button className="btn-page" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
