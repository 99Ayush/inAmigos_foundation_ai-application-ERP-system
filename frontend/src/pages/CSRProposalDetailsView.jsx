import React from 'react';
import './CSRProposalDetailsView.css';

export default function CSRProposalDetailsView({ proposal, onBack, onAccept, onReject }) {
  if (!proposal) return null;

  return (
    <div className="csr-details-page">
      <div className="csr-details-top-bar">
        <button className="btn-back-link" onClick={onBack}>
          ← Back to CSR Funding Pipeline
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
            Grant Proposal ID #{proposal.id}
          </span>
          <span
            style={{
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 700,
              background:
                proposal.status === 'Approved'
                  ? '#ecfdf5'
                  : proposal.status === 'Rejected'
                  ? '#fef2f2'
                  : '#fffbeb',
              color:
                proposal.status === 'Approved'
                  ? '#059669'
                  : proposal.status === 'Rejected'
                  ? '#dc2626'
                  : '#d97706',
              border: '1px solid #e2e8f0'
            }}
          >
            {proposal.status}
          </span>
        </div>
      </div>

      <div className="csr-details-grid">
        {/* Left Column: Corporate Profile & Grant Statement */}
        <div className="csr-details-card">
          <div className="csr-details-card-title">
            <span>🏢</span>
            <span>Corporate Entity & Grantor Dossier</span>
          </div>

          <div className="csr-amount-hero">
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase' }}>
                Pledged Institutional Capital
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                {proposal.companyName}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="csr-hero-num">₹{(proposal.pledgedAmount / 100000).toFixed(1)}L</div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#7c3aed' }}>Direct Grant Allocation</div>
            </div>
          </div>

          <div className="details-field-row">
            <div className="details-field-group">
              <span className="details-label">Lead CSR Officer</span>
              <span className="details-value">{proposal.contactPerson}</span>
            </div>
            <div className="details-field-group">
              <span className="details-label">Official Corporate Email</span>
              <span className="details-value">{proposal.email}</span>
            </div>
          </div>

          <div className="details-field-group">
            <span className="details-label">Targeted InAmigos Core Initiative</span>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#059669', marginTop: '2px' }}>
              🎯 {proposal.targetedInitiative}
            </div>
          </div>

          <div className="details-field-group">
            <span className="details-label">Formal CSR Proposal Statement</span>
            <div className="raw-statement-full">"{proposal.proposalSummary}"</div>
          </div>
        </div>

        {/* Right Column: Financial Compliance & Legal Terms */}
        <div className="csr-details-card">
          <div className="csr-details-card-title">
            <span>⚖️</span>
            <span>CSR Compliance & Statutory Governance</span>
          </div>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
              Indian Companies Act Section 135 Compliance
            </div>
            <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
              • 80G Tax Exemption Certificate: <strong>Verified & Valid</strong><br />
              • FCRA Status: <strong>Non-Foreign Domestic Entity</strong><br />
              • CSR-1 Registration No: <strong>CSR00029482 (Approved)</strong><br />
              • Audit Frequency: <strong>Quarterly Fund Tranche Releases</strong>
            </p>
          </div>

          <div style={{ background: '#ecfdf5', padding: '16px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#047857' }}>
              Capital Disbursement Schedule:
            </div>
            <div style={{ fontSize: '12px', color: '#065f46', marginTop: '4px', lineHeight: 1.5 }}>
              1. 50% Initial Mobilization Advance (Upon Signing)<br />
              2. 30% Mid-Term Milestone & Beneficiary Verification<br />
              3. 20% Final Impact Audit & Utilization Certificate
            </div>
          </div>

          {proposal.status === 'Under Review' && (
            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '10px' }}>
              <button
                className="btn-action-primary"
                style={{ flex: 1 }}
                onClick={() => {
                  onAccept(proposal.id);
                  alert(`✓ Approved CSR Grant of ₹${(proposal.pledgedAmount / 100000).toFixed(1)}L from ${proposal.companyName}!`);
                }}
              >
                ✓ Approve & Sign Grant
              </button>
              <button
                className="btn-action-danger"
                onClick={() => {
                  onReject(proposal.id);
                  alert(`Decline notification sent to ${proposal.companyName}.`);
                }}
              >
                Decline Proposal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
