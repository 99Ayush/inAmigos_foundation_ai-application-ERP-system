import React, { useState } from 'react';
import './RunningInitiativesMonitor.css';

const INITIATIVES_DETAILED_DATA = [
  {
    id: 1,
    title: 'Project Bachpanshala',
    category: 'Education & Child Literacy',
    icon: '📚',
    status: 'Active',
    volunteersDeployed: 42,
    hoursDelivered: 420,
    beneficiariesCount: 850,
    fundingRaised: 350000,
    targetGoal: 500000,
    csrPartner: 'Tata Steel CSR Foundation',
    location: 'North Delhi Slum Cluster',
    leadCoordinator: 'Pooja Verma (TPO Ops)'
  },
  {
    id: 2,
    title: 'Project Jeev',
    category: 'Animal Welfare & Rescue',
    icon: '🐾',
    status: 'Active',
    volunteersDeployed: 28,
    hoursDelivered: 280,
    beneficiariesCount: 420,
    fundingRaised: 280000,
    targetGoal: 350000,
    csrPartner: 'Wipro Cares Animal Support',
    location: 'Gurugram & South Delhi',
    leadCoordinator: 'Dr. Nikhil Rao'
  },
  {
    id: 3,
    title: 'Project Seva',
    category: 'Zero Hunger Community Kitchen',
    icon: '🍲',
    status: 'Active',
    volunteersDeployed: 35,
    hoursDelivered: 510,
    beneficiariesCount: 2200,
    fundingRaised: 450000,
    targetGoal: 500000,
    csrPartner: 'Infosys Foundation',
    location: 'Noida Migrant Hub',
    leadCoordinator: 'Ravi Malhotra'
  },
  {
    id: 4,
    title: 'Project Prakriti',
    category: 'Urban Afforestation & Climate',
    icon: '🌱',
    status: 'Active',
    volunteersDeployed: 31,
    hoursDelivered: 310,
    beneficiariesCount: 1500,
    fundingRaised: 220000,
    targetGoal: 300000,
    csrPartner: 'ITC Green Sustainability',
    location: 'Yamuna Floodplain Zone',
    leadCoordinator: 'Meera Deshmukh'
  },
  {
    id: 5,
    title: 'Project Udaan',
    category: 'Women Skill & Livelihood',
    icon: '🕊️',
    status: 'Active',
    volunteersDeployed: 24,
    hoursDelivered: 260,
    beneficiariesCount: 380,
    fundingRaised: 290000,
    targetGoal: 400000,
    csrPartner: 'Mahindra Pride CSR',
    location: 'Faridabad Rural Block',
    leadCoordinator: 'Sunita Sharma'
  }
];

export default function RunningInitiativesMonitor({
  onViewFullDirectory,
  onSelectInitiative = null,
  maxItems = 2,
  isAdmin = true
}) {
  const [search, setSearch] = useState('');
  
  const filteredInitiatives = INITIATIVES_DETAILED_DATA.filter(init => {
    const q = search.toLowerCase();
    return !q || 
      init.title.toLowerCase().includes(q) || 
      init.category.toLowerCase().includes(q) ||
      init.location.toLowerCase().includes(q);
  });

  const displayList = maxItems ? filteredInitiatives.slice(0, maxItems) : filteredInitiatives;

  return (
    <div className="initiatives-monitor-card">
      <div className="monitor-header">
        <div>
          <h3>
            <span className="live-pulse" />
            Initiatives
          </h3>
          <p>Active core programs</p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {!maxItems && (
            <input
              type="text"
              placeholder="Search initiatives..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '11px',
                width: '160px'
              }}
            />
          )}

          {!maxItems && isAdmin && (
            <button
              onClick={() => alert('Add Initiative flow active for Admins.')}
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
              + Add Initiative
            </button>
          )}

          {maxItems && onViewFullDirectory && (
            <button
              onClick={onViewFullDirectory}
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#059669',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '6px',
                padding: '4px 10px',
                cursor: 'pointer'
              }}
            >
              All ({INITIATIVES_DETAILED_DATA.length}) →
            </button>
          )}
        </div>
      </div>

      <div className="initiatives-list">
        {displayList.map((init) => {
          const progressPct = Math.min(100, Math.round((init.fundingRaised / init.targetGoal) * 100));

          return (
            <div
              key={init.id}
              className="initiative-row-item"
              onClick={() => onSelectInitiative && onSelectInitiative(init)}
              title="Click to view full operational details"
            >
              <div className="init-row-header">
                <div className="init-title-group">
                  <div className="init-icon-badge">{init.icon}</div>
                  <div>
                    <div className="init-name-text">{init.title}</div>
                    <div className="init-category-tag">{init.category}</div>
                  </div>
                </div>
                <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>Open →</span>
              </div>

              <div className="init-compact-metrics">
                <span>👥 <strong>{init.volunteersDeployed}</strong> Volunteers</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div className="init-prog-track">
                    <div className="init-prog-fill" style={{ width: `${progressPct}%` }} />
                  </div>
                  <span>{progressPct}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {maxItems && INITIATIVES_DETAILED_DATA.length > maxItems && (
        <button className="btn-more-tab-link" onClick={onViewFullDirectory}>
          + View {INITIATIVES_DETAILED_DATA.length - maxItems} More in Initiatives Tab →
        </button>
      )}
    </div>
  );
}
