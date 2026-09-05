import React, { useState } from 'react';
import './CorporateFundingPanel.css';

export default function CorporateFundingPanel({
  proposals = [],
  maxItems = null,
  onViewAllFunding = null,
  onSelectProposal = null,
  isAdmin = true
}) {
  const [search, setSearch] = useState('');
  
  const filteredProposals = proposals.filter(p => {
    const q = search.toLowerCase();
    return !q || 
      p.companyName.toLowerCase().includes(q) || 
      p.targetedInitiative.toLowerCase().includes(q) ||
      p.status.toLowerCase().includes(q);
  });

  const displayList = maxItems ? filteredProposals.slice(0, maxItems) : filteredProposals;

  return (
    <div className="csr-proposals-card">
      <div className="csr-header">
        <div>
          <h3>💼 CSR Funding</h3>
          <p>Inbound grants pipeline</p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {!maxItems && (
            <input
              type="text"
              placeholder="Search sponsors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '11px',
                width: '140px'
              }}
            />
          )}

          {!maxItems && isAdmin && (
            <button
              onClick={() => alert('Add CSR Sponsor flow active for Admins.')}
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#ffffff',
                background: '#059669',
                border: 'none',
                borderRadius: '6px',
                padding: '5px 10px',
                cursor: 'pointer'
              }}
            >
              + Add Sponsor
            </button>
          )}

          {maxItems && onViewAllFunding && (
            <button
              onClick={onViewAllFunding}
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#7c3aed',
                background: '#f5f3ff',
                border: '1px solid #ddd6fe',
                borderRadius: '6px',
                padding: '4px 10px',
                cursor: 'pointer'
              }}
            >
              All ({proposals.length}) →
            </button>
          )}
        </div>
      </div>

      <div className="csr-proposals-list">
        {displayList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '11px' }}>
            No incoming corporate proposals.
          </div>
        ) : (
          displayList.map((prop) => (
            <div
              key={prop.id}
              className="csr-proposal-row"
              onClick={() => onSelectProposal && onSelectProposal(prop)}
              title="Click to view deep financial and legal dossier"
            >
              <div className="csr-row-top">
                <div className="csr-company-name">{prop.companyName}</div>
                <div className="csr-amount-badge">
                  ₹{(prop.pledgedAmount / 100000).toFixed(1)}L
                </div>
              </div>

              {maxItems ? (
                <div className="csr-compact-info">
                  <span>🎯 {prop.targetedInitiative}</span>
                  <span
                    style={{
                      fontWeight: 700,
                      color: prop.status === 'Approved' ? '#059669' : '#d97706'
                    }}
                  >
                    {prop.status} →
                  </span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                    <span>🎯 {prop.targetedInitiative}</span>
                    <span style={{ fontWeight: 600 }}>Disbursement: Q3 2026</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', background: '#f8fafc', padding: '2px 6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                      Docs: 80G Verified, CSR-1 Pending
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: prop.status === 'Approved' ? '#059669' : '#d97706'
                      }}
                    >
                      {prop.status} →
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {maxItems && proposals.length > maxItems && onViewAllFunding && (
        <button className="btn-more-tab-link" onClick={onViewAllFunding}>
          + View {proposals.length - maxItems} More in Funding Tab →
        </button>
      )}
    </div>
  );
}
