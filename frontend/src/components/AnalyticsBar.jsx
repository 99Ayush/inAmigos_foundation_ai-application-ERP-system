import React from 'react';
import './AnalyticsBar.css';

export default function AnalyticsBar({
  applications = [],
  corporateProposals = [],
  onTileClick = null
}) {
  const total = applications.length;
  const aiTriaged = applications.filter((a) => {
    const s = (a.STATUS || a.status || '').toLowerCase();
    return s === 'ai_triaged' || s === 'accepted';
  }).length;
  const pending = applications.filter((a) => {
    const s = (a.STATUS || a.status || '').toLowerCase();
    return s === 'pending' || s === 'pending_manual_review' || s === 'submitted' || s === 'manual_review';
  }).length;
  const accepted = applications.filter((a) => (a.STATUS || a.status || '').toLowerCase() === 'accepted').length;

  const aiPct = total > 0 ? Math.round((aiTriaged / total) * 100) : 0;
  const totalCommittedFunding = corporateProposals.reduce((sum, p) => sum + (p.pledgedAmount || 0), 0);

  const tiles = [
    {
      id: 'total_applicants',
      icon: '👥',
      boxClass: 'blue',
      value: total,
      label: 'Total Applicants',
      delta: '+12% MoM',
      deltaType: 'up',
      viewTarget: 'applicants',
      hint: 'Click to view all profiles →'
    },
    {
      id: 'ai_matched',
      icon: '🤖',
      boxClass: 'green',
      value: `${aiPct}%`,
      label: 'AI Auto-Matched',
      delta: `${aiTriaged} candidates`,
      deltaType: 'up',
      viewTarget: 'applicants',
      hint: 'Click to view AI matches →'
    },
    {
      id: 'pending_triage',
      icon: '⏳',
      boxClass: 'amber',
      value: pending,
      label: 'Needs Manual Triage',
      delta: pending > 0 ? `${pending} pending` : 'All clear',
      deltaType: pending > 2 ? 'down' : 'neutral',
      viewTarget: 'kanban',
      hint: 'Click to open Triage Board →'
    },
    {
      id: 'csr_funding',
      icon: '💼',
      boxClass: 'purple',
      value: `₹${(totalCommittedFunding / 100000).toFixed(1)}L`,
      label: 'CSR Funding Pipeline',
      delta: `${corporateProposals.length} sponsors`,
      deltaType: 'up',
      viewTarget: 'funding',
      hint: 'Click to review grants →'
    }
  ];

  return (
    <div className="analytics-bar">
      {tiles.map((t) => (
        <div
          className="metric-tile"
          key={t.id}
          onClick={() => onTileClick && onTileClick(t.viewTarget, t.id)}
          title={`Click to navigate to ${t.label}`}
        >
          <div className="metric-tile-top">
            <div className={`metric-icon-box ${t.boxClass}`}>{t.icon}</div>
            <span className={`metric-delta-pill ${t.deltaType}`}>{t.delta}</span>
          </div>
          <div className="metric-body">
            <div className="metric-value">{t.value}</div>
            <div className="metric-label">{t.label}</div>
            <div className="metric-click-hint">{t.hint}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
