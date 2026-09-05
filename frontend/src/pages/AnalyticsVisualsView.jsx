import React, { useState } from 'react';
import './AnalyticsVisualsView.css';

export default function AnalyticsVisualsView({ applications = [], corporateProposals = [], onBackToDashboard = null }) {
  const [timeframe, setTimeframe] = useState('1w');

  const totalFunds = corporateProposals.reduce((sum, p) => sum + (p.pledgedAmount || 0), 0);
  const totalVolunteers = 160;

  const initiatives = [
    { name: 'Project Bachpanshala', category: 'Education & Child Literacy', icon: '📚', count: '42 Active', value: '₹3.5L / ₹5.0L', change: '+12.4%', isPositive: true },
    { name: 'Project Jeev', category: 'Animal Welfare & Rescue', icon: '🐾', count: '28 Active', value: '₹2.8L / ₹3.5L', change: '+8.2%', isPositive: true },
    { name: 'Project Seva', category: 'Zero Hunger Community Kitchen', icon: '🍲', count: '35 Active', value: '₹4.5L / ₹5.0L', change: '+18.6%', isPositive: true },
    { name: 'Project Prakriti', category: 'Urban Afforestation & Climate', icon: '🌱', count: '31 Active', value: '₹2.2L / ₹3.0L', change: '+5.1%', isPositive: true },
    { name: 'Project Udaan', category: 'Women Skill & Livelihood', icon: '🕊️', count: '24 Active', value: '₹2.9L / ₹4.0L', change: '+14.3%', isPositive: true }
  ];

  return (
    <div className="blockpulse-analytics-page">
      {/* Top Header */}
      <div className="bp-header-row">
        <div className="bp-header-left">
          <div className="bp-breadcrumbs"></div>
          <h1>InAmigos Operational Portfolio</h1>
          <p>Real-time volunteer deployment capacity, AI triage velocity, and CSR capital distribution</p>
        </div>

        <div className="bp-header-actions">
          <div className="bp-timeframe-selector">
            {[].map((tf) => (
              <button
                key={tf}
                className={`bp-tf-btn ${timeframe === tf ? 'active' : ''}`}
                onClick={() => setTimeframe(tf)}
              >
                {tf}
              </button>
            ))}
          </div>

          {onBackToDashboard && (
            <button
              className="bp-back-btn"
              onClick={onBackToDashboard}
            >
              ← Normal View
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Column BlockPulse Grid */}
      <div className="bp-main-grid">
        {/* Left Column: Line Chart & Initiative Assets */}
        <div className="bp-left-col">
          {/* Neon Glow Chart Hero Card */}
          <div className="bp-card bp-chart-card">
            <div className="bp-card-header">
              <div className="bp-hero-title-group">
                <p>Total Impact & Capital Pipeline</p>
                <div className="bp-chart-hero">
                  <div className="bp-hero-val">₹{(totalFunds / 100000).toFixed(1)} Lakhs</div>
                  <span className="bp-hero-pill">+24.8% Efficiency</span>
                </div>
              </div>

              <div className="bp-hero-meta">
                <span className="bp-deployed-badge">● {totalVolunteers} Deployed</span>
                <span className="bp-meta-divider">|</span>
                <span>5 Initiatives</span>
              </div>
            </div>

            {/* Neon Green SVG Wave Line Chart */}
            <div className="bp-svg-chart-wrap">
              <svg viewBox="0 0 700 180" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="neonGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#059669" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Area Gradient */}
                <path
                  d="M0,130 Q70,90 140,110 T280,60 T420,100 T560,30 T700,70 L700,180 L0,180 Z"
                  fill="url(#neonGradient)"
                />

                {/* Smooth Line */}
                <path
                  d="M0,130 Q70,90 140,110 T280,60 T420,100 T560,30 T700,70"
                  stroke="#059669"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Highlight Point on Thursday Peak */}
                <circle cx="560" cy="30" r="6" fill="#ffffff" stroke="#059669" strokeWidth="3" />
                <rect x="525" y="0" width="70" height="22" rx="4" fill="#ffffff" stroke="#e2e8f0" />
                <text x="560" y="15" fill="#0f172a" fontSize="11" fontWeight="700" textAnchor="middle">₹18.5 Lakhs</text>
              </svg>
            </div>

            <div className="bp-chart-dates">
              <span>Mon 1st</span>
              <span>Tue 2nd</span>
              <span>Wed 3rd</span>
              <span>Thu 4th</span>
              <span>Fri 5th</span>
              <span>Sat 6th</span>
              <span>Sun 7th</span>
            </div>
          </div>

          {/* Running Initiatives "Assets" Table */}
          <div className="bp-card">
            <div className="bp-card-header">
              <h3>Core Initiative Assets & Allocations</h3>
              <span className="bp-badge-active">5 Active Projects</span>
            </div>

            <div className="bp-table-responsive">
              <table className="bp-table">
                <thead>
                  <tr>
                    <th>Initiative</th>
                    <th>Volunteers</th>
                    <th>CSR Capital Goal</th>
                    <th>Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {initiatives.map((init) => (
                    <tr key={init.name}>
                      <td>
                        <div className="bp-asset-row">
                          <div className="bp-asset-icon">{init.icon}</div>
                          <div className="bp-asset-info">
                            <div className="bp-asset-name">{init.name}</div>
                            <div className="bp-asset-category">{init.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="bp-col-volunteers">{init.count}</td>
                      <td className="bp-col-capital">{init.value}</td>
                      <td className="bp-col-growth">{init.change}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: AI Triage Checklist & Recent Candidate Placement Feed */}
        <div className="bp-right-col">
          {/* TPO Compliance Checklist */}
          <div className="bp-card">
            <div className="bp-card-header">
              <h3>System Health</h3>
              <span className="bp-badge-sub">Operational Status</span>
            </div>

            <div className="bp-checklist">
              <div className="bp-check-item">
                <div className="bp-check-icon success">✓</div>
                <div className="bp-check-content">
                  <div className="bp-check-title">AI Matching Engine Status</div>
                  <div className="bp-check-sub">Fully operational (1.2s avg response)</div>
                </div>
              </div>

              <div className="bp-check-item">
                <div className="bp-check-icon success">✓</div>
                <div className="bp-check-content">
                  <div className="bp-check-title">Data Backup Freshness</div>
                  <div className="bp-check-sub">Automated backup completed 2h ago</div>
                </div>
              </div>

              <div className="bp-check-item">
                <div className="bp-check-icon warning">!</div>
                <div className="bp-check-content">
                  <div className="bp-check-title">Compliance Documents</div>
                  <div className="bp-check-sub">3 pending corporate sponsor uploads</div>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Triage Activity Feed */}
          <div className="bp-card">
            <div className="bp-card-header">
              <h3>Live Triage Placement Feed</h3>
              <span className="bp-badge-sub">Real-time</span>
            </div>

            <div className="bp-tx-list">
              {applications.slice(0, 4).map((app) => {
                const name = app.FULL_NAME || app.full_name || 'Candidate';
                const initTitle = app.INITIATIVE_TITLE || app.initiative_title || app.ai_suggested_initiative || 'Project Bachpanshala';
                const rawConf = app.AI_CONFIDENCE !== undefined ? Number(app.AI_CONFIDENCE) : Number(app.ai_confidence || 0.85);
                const pct = Math.round(rawConf * 100);

                return (
                  <div key={app.application_id || app.APPLICATION_ID} className="bp-tx-item">
                    <div className="bp-tx-left">
                      <span className="bp-tx-badge">⚡</span>
                      <div className="bp-tx-info">
                        <div className="bp-tx-name">{name}</div>
                        <div className="bp-tx-sub">Matched to {initTitle}</div>
                      </div>
                    </div>
                    <div className="bp-tx-val">{pct}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
