import React from 'react';
import './InitiativeDetailsView.css';

export default function InitiativeDetailsView({ initiative, onBack }) {
  if (!initiative) return null;

  const progressPct = Math.min(100, Math.round(((initiative.fundingRaised || 350000) / (initiative.targetGoal || 500000)) * 100));

  return (
    <div className="initiative-details-page">
      <div className="init-details-top-bar">
        <button className="btn-back-link" onClick={onBack}>
          ← Back to Initiatives Directory
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
            Initiative ID #{initiative.id || 1}
          </span>
          <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px', background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}>
            {initiative.status || 'Active'}
          </span>
        </div>
      </div>

      <div className="init-details-grid">
        {/* Left Column: Operational Summary & Beneficiaries */}
        <div className="init-details-card">
          <div className="init-details-card-title">
            <span style={{ fontSize: '20px' }}>{initiative.icon || '🎯'}</span>
            <span>{initiative.title} — Operational Dossier</span>
          </div>

          <div>
            <span className="details-label">Category & Geographic Hub</span>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
              {initiative.category || 'Core Mission'} · {initiative.location || 'Delhi NCR'}
            </div>
          </div>

          <div className="init-stats-quad">
            <div>
              <div className="init-quad-val">{initiative.volunteersDeployed || 42}</div>
              <div className="init-quad-lbl">Volunteers</div>
            </div>
            <div>
              <div className="init-quad-val">{initiative.hoursDelivered || 420}h</div>
              <div className="init-quad-lbl">Hours Contributed</div>
            </div>
            <div>
              <div className="init-quad-val">{initiative.beneficiariesCount || 850}</div>
              <div className="init-quad-lbl">Beneficiaries</div>
            </div>
            <div>
              <div className="init-quad-val">₹{((initiative.fundingRaised || 350000) / 1000).toFixed(0)}k</div>
              <div className="init-quad-lbl">Funds Raised</div>
            </div>
          </div>

          <div>
            <span className="details-label">Mission Objectives & Field Scope</span>
            <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6, background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '4px' }}>
              Providing structured grassroots execution, volunteer deployment workflows, primary education/welfare drives, and verifiable digital literacy programs for underserved communities.
            </div>
          </div>

          <div>
            <span className="details-label">Assigned TPO Lead & Operations Coordinator</span>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>
              👤 {initiative.leadCoordinator || 'Pooja Verma (TPO Operations Lead)'}
            </div>
          </div>
        </div>

        {/* Right Column: CSR Grant & Financial Breakdown */}
        <div className="init-details-card">
          <div className="init-details-card-title">
            <span>💼</span>
            <span>CSR Capital & Financial Utilization</span>
          </div>

          <div className="init-csr-detail-box">
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase' }}>
              Lead Corporate Sponsor
            </span>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
              {initiative.csrPartner || 'Tata Steel CSR Foundation'}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Institutional partner providing infrastructure sponsorship and operational budget allocation.
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
              <span>CSR Funding Goal Progress</span>
              <span style={{ color: '#059669' }}>₹{((initiative.fundingRaised || 350000) / 100000).toFixed(1)}L of ₹{((initiative.targetGoal || 500000) / 100000).toFixed(1)}L ({progressPct}%)</span>
            </div>
            <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progressPct}%`, background: '#059669', borderRadius: '999px' }} />
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
            <strong>Audited Expense Distribution:</strong><br />
            • 60% — Learning materials, nutritional meals, or veterinary medicines<br />
            • 25% — Field logistics, student transport & volunteer insurance<br />
            • 15% — Impact monitoring & progress compliance tracking
          </div>
        </div>
      </div>
    </div>
  );
}
