import React, { useState } from 'react';
import VolunteerForm from '../components/VolunteerForm';
import './VolunteerPortalView.css';

export default function VolunteerPortalView({ applications = [], onSubmitSuccess }) {
  const [tab, setTab] = useState('form');
  const [selectedApp, setSelectedApp] = useState(null);

  return (
    <div className="volunteer-portal-wrapper">
      <div className="portal-tabs">
        <button
          className={`portal-tab-btn ${tab === 'form' ? 'active' : ''}`}
          onClick={() => setTab('form')}
        >
          <span className="portal-tab-icon">📝</span>
          <span>New Application</span>
        </button>
        <button
          className={`portal-tab-btn ${tab === 'tracker' ? 'active' : ''}`}
          onClick={() => setTab('tracker')}
        >
          <span className="portal-tab-icon">📋</span>
          <span>My Applications</span>
          {applications.length > 0 && (
            <span className="portal-tab-badge">{applications.length}</span>
          )}
        </button>
      </div>

      {tab === 'form' ? (
        <VolunteerForm onSubmitSuccess={onSubmitSuccess} />
      ) : (
        <div className="tracker-card-list">
          {applications.length === 0 ? (
            <div className="tracker-empty">
              <div className="tracker-empty-icon">📋</div>
              <h3>No Applications Yet</h3>
              <p>Submit your first volunteer application to get started.</p>
              <button className="tracker-cta" onClick={() => setTab('form')}>
                Apply Now →
              </button>
            </div>
          ) : (
            applications.map((app) => {
              const appId = app.APPLICATION_ID || app.application_id;
              const title = app.INITIATIVE_TITLE || app.initiative_title || app.AI_SUGGESTED_INITIATIVE || app.ai_suggested_initiative || 'Pending Assignment';
              const confidence = Math.round((app.AI_CONFIDENCE || app.ai_confidence || 0) * 100);
              const rawStatus = (app.STATUS || app.status || 'submitted').toLowerCase();

              const statusMap = {
                submitted: { label: 'Submitted', color: '#64748b', bg: '#f1f5f9' },
                ai_triaged: { label: 'AI Triaged', color: '#2563eb', bg: '#eff6ff' },
                manual_review: { label: 'Under Review', color: '#d97706', bg: '#fffbeb' },
                accepted: { label: 'Accepted ✓', color: '#059669', bg: '#ecfdf5' },
                rejected: { label: 'Rejected', color: '#dc2626', bg: '#fef2f2' }
              };
              const s = statusMap[rawStatus] || statusMap.submitted;

              return (
                <div
                  key={appId}
                  className="tracker-card clickable"
                  onClick={() => setSelectedApp(app)}
                >
                  <div className="tracker-card-left">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="tracker-app-id">APPLICATION #{appId}</span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>• Click to view details</span>
                    </div>
                    <h4 className="tracker-title">{title}</h4>
                    <p className="tracker-meta">
                      AI Match Confidence: <strong>{confidence}%</strong> · "{(app.RAW_STATEMENT || app.raw_statement || '').slice(0, 60)}..."
                    </p>
                  </div>
                  <div className="tracker-card-right">
                    <span
                      className="tracker-status-badge"
                      style={{ color: s.color, background: s.bg, border: `1px solid ${s.color}33` }}
                    >
                      {s.label}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ─── APPLICANT DETAIL MODAL ─── */}
      {selectedApp && (
        <div className="app-detail-modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="app-detail-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="app-detail-modal-header">
              <div>
                <span className="detail-app-tag">APPLICATION #{selectedApp.APPLICATION_ID || selectedApp.application_id}</span>
                <h2>{selectedApp.INITIATIVE_TITLE || selectedApp.ai_suggested_initiative || selectedApp.AI_SUGGESTED_INITIATIVE || 'Foundation Placement'}</h2>
              </div>
              <button className="detail-close-btn" onClick={() => setSelectedApp(null)}>×</button>
            </div>

            <div className="app-detail-modal-body">
              {/* Status Header */}
              <div className="detail-status-box">
                <span className="detail-box-label">Current Placement Status</span>
                <div className="detail-status-pill-wrap">
                  <span className="detail-status-pill">
                    {(selectedApp.STATUS || selectedApp.status || 'Submitted').toUpperCase()}
                  </span>
                  <span className="detail-status-desc">
                    {(selectedApp.STATUS || selectedApp.status) === 'accepted'
                      ? 'Congratulations! Your profile has been accepted into this initiative.'
                      : (selectedApp.STATUS || selectedApp.status) === 'rejected'
                      ? 'Application was not selected for this term.'
                      : 'Under evaluation by Gemini AI and InAmigos coordinators.'}
                  </span>
                </div>
              </div>

              {/* Applicant Info */}
              <div className="detail-info-grid">
                <div className="detail-info-item">
                  <span className="info-lbl">Applicant Name</span>
                  <span className="info-val">{selectedApp.FULL_NAME || selectedApp.full_name || 'Volunteer Applicant'}</span>
                </div>
                <div className="detail-info-item">
                  <span className="info-lbl">Email Address</span>
                  <span className="info-val">{selectedApp.EMAIL || selectedApp.email || 'N/A'}</span>
                </div>
                <div className="detail-info-item">
                  <span className="info-lbl">Skills & Competencies</span>
                  <span className="info-val">{selectedApp.SKILLS || selectedApp.skills || 'General Volunteering'}</span>
                </div>
                <div className="detail-info-item">
                  <span className="info-lbl">Weekly Availability</span>
                  <span className="info-val">{selectedApp.AVAILABILITY_HOURS || selectedApp.availability_hours || 4} Hours / Week</span>
                </div>
              </div>

              {/* Statement of Purpose */}
              <div className="detail-section">
                <h4>Submitted Statement of Purpose</h4>
                <p className="detail-statement-box">
                  "{selectedApp.RAW_STATEMENT || selectedApp.raw_statement}"
                </p>
              </div>

              {/* AI Evaluation */}
              <div className="detail-section">
                <h4>Gemini 2.5 AI Triage Analysis</h4>
                <div className="detail-ai-card">
                  <div className="ai-row">
                    <span>Matched Project:</span>
                    <strong>{selectedApp.AI_SUGGESTED_INITIATIVE || selectedApp.ai_suggested_initiative || 'General Operations'}</strong>
                  </div>
                  <div className="ai-row">
                    <span>Match Confidence:</span>
                    <strong>{Math.round((selectedApp.AI_CONFIDENCE || selectedApp.ai_confidence || 0.85) * 100)}%</strong>
                  </div>
                  <p className="ai-reasoning">
                    💡 Reasoning: {selectedApp.AI_REASONING || selectedApp.ai_reasoning || 'Matched based on relevant skill keywords and commitment hours.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="app-detail-modal-footer">
              <button className="btn-close-modal" onClick={() => setSelectedApp(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
