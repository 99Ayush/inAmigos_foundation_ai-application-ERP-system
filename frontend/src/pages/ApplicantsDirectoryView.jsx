import React, { useState } from 'react';
import './ApplicantsDirectoryView.css';

export default function ApplicantsDirectoryView({ applications = [], onSelectApplication }) {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = applications.filter((app) => {
    const name = app.FULL_NAME || app.full_name || '';
    const email = app.EMAIL || app.email || '';
    const skills = app.SKILLS || app.skills || '';
    const status = app.STATUS || app.status || 'Pending';
    const initTitle = app.INITIATIVE_TITLE || app.initiative_title || app.ai_suggested_initiative || '';

    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      name.toLowerCase().includes(q) ||
      email.toLowerCase().includes(q) ||
      skills.toLowerCase().includes(q) ||
      initTitle.toLowerCase().includes(q);

    const matchStatus = filter === 'ALL' || status === filter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="applicants-directory-page">
      <div className="directory-header-card">
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
            👥 All Volunteer Candidates & AI Skill Match Directory
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            Inspect candidate expertise, AI-suggested initiative placements, and availability metrics
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search candidate name, skills, initiative..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '12px',
              width: '260px'
            }}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '12px',
              background: '#f8fafc',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Statuses ({applications.length})</option>
            <option value="submitted">Submitted</option>
            <option value="ai_triaged">AI Triaged</option>
            <option value="manual_review">Manual Review Required</option>
            <option value="accepted">Accepted Candidates</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="candidates-grid">
        {filtered.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '48px', textAlign: 'center', color: '#94a3b8', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            No candidates match your selected filters.
          </div>
        ) : (
          filtered.map((app) => {
            const appId = app.APPLICATION_ID || app.application_id;
            const name = app.FULL_NAME || app.full_name || 'Anonymous';
            const email = app.EMAIL || app.email || '';
            const hours = app.AVAILABILITY_HOURS || app.availability_hours || 10;
            const skillsStr = app.SKILLS || app.skills || 'General';
            const skillsList = skillsStr.split(',').map((s) => s.trim()).slice(0, 4);
            const initTitle = app.INITIATIVE_TITLE || app.initiative_title || app.AI_SUGGESTED_INITIATIVE || app.ai_suggested_initiative || 'Project Bachpanshala';
            const rawConf = app.AI_CONFIDENCE !== undefined ? Number(app.AI_CONFIDENCE) : Number(app.ai_confidence || 0.85);
            const confidencePct = Math.round(rawConf * 100);
            const status = app.STATUS || app.status || 'Pending';
            const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

            return (
              <div
                key={appId}
                className="candidate-card-full"
                onClick={() => onSelectApplication(app)}
              >
                <div className="cand-top-row">
                  <div className="cand-avatar-circle">{initials}</div>
                  <div className="cand-meta-block">
                    <div className="cand-name">{name}</div>
                    <div className="cand-sub">{email} · {hours}h/wk</div>
                  </div>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: status === 'accepted' ? '#ecfdf5' : status === 'rejected' ? '#fef2f2' : '#eff6ff',
                      color: status === 'accepted' ? '#059669' : status === 'rejected' ? '#dc2626' : '#2563eb'
                    }}
                  >
                    {status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Candidate Skills & Expertise:
                  </div>
                  <div className="cand-skills-row">
                    {skillsList.map((skill, i) => (
                      <span key={i} className="cand-skill-badge">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="cand-ai-bar">
                  <div>
                    <div style={{ fontSize: '9px', fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>
                      AI Recommended Placement
                    </div>
                    <div className="cand-init-tag">{initTitle}</div>
                  </div>
                  <div className="cand-conf-tag">{confidencePct}%</div>
                </div>

                <div className="cand-footer-row">
                  <span style={{ fontSize: '11px', color: '#64748b' }}>App #{appId}</span>
                  <button
                    className="btn-inspect-profile"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectApplication(app);
                    }}
                  >
                    Open Dossier →
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
