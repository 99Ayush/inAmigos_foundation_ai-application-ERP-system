import React, { useState } from 'react';
import './AuditTrailView.css';

export default function AuditTrailView({ auditLogs = [] }) {
  const [filterType, setFilterType] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    if (filterType === 'ALL') return true;
    return log.category === filterType;
  });

  return (
    <div className="audit-trail-page">
      <div className="audit-header-card">
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
            📜 Statutory Audit Trail & CSR Compliance Log
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            Immutable ledger tracking all triage status transitions, CSR grant approvals, and capital disbursements
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '12px',
              background: '#f8fafc',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Event Types ({auditLogs.length})</option>
            <option value="CSR_GRANT">CSR Grant Approvals</option>
            <option value="TRIAGE_DECISION">Candidate Triage Decisions</option>
            <option value="SYSTEM">System & AI Middleware Events</option>
          </select>
        </div>
      </div>

      <div className="audit-log-card">
        <table className="audit-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor & Role</th>
              <th>Event Action</th>
              <th>Target Entity</th>
              <th>Details & Statutory Note</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                  No audit trail records found.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ color: '#64748b', fontSize: '12px', whiteSpace: 'nowrap' }}>
                    {log.timestamp}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{log.actorName}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{log.actorRole}</div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{log.action}</td>
                  <td style={{ fontWeight: 700, color: '#059669' }}>{log.target}</td>
                  <td style={{ fontSize: '12px', color: '#334155' }}>{log.details}</td>
                  <td>
                    <span
                      className={`audit-badge ${
                        log.category === 'CSR_GRANT'
                          ? 'grant'
                          : log.category === 'TRIAGE_DECISION'
                          ? 'triage'
                          : 'security'
                      }`}
                    >
                      {log.category.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
