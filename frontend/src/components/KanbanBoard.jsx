import React from 'react';
import './KanbanBoard.css';

const COLUMNS = [
  { id: 'submitted', title: 'Submitted', dotClass: 'pending', statuses: ['submitted'] },
  { id: 'ai_triaged', title: 'AI Triaged', dotClass: 'review', statuses: ['ai_triaged'] },
  { id: 'review', title: 'Manual Review', dotClass: 'backlog', statuses: ['manual_review'] },
  { id: 'accepted', title: 'Accepted', dotClass: 'accepted', statuses: ['accepted'] },
  { id: 'rejected', title: 'Rejected', dotClass: 'rejected', statuses: ['rejected'] },
];

const PRIORITY_MAP = {
  'Project Bachpanshala': { label: 'High', cls: 'priority-high' },
  'Project Jeev':         { label: 'Medium', cls: 'priority-medium' },
  'Project Seva':         { label: 'Urgent', cls: 'priority-high' },
  'Project Prakriti':     { label: 'Medium', cls: 'priority-medium' },
  'Project Udaan':        { label: 'High', cls: 'priority-high' },
  'General Operations':   { label: 'Low', cls: 'priority-low' },
};

export default function KanbanBoard({ applications = [], onCardClick }) {
  return (
    <div className="kanban-section">
      <div className="kanban-header">
        <div>
          <h3>Volunteer Pipeline Board</h3>
          <p>Monitor real-time candidate triage transitions across operational stages</p>
        </div>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#64748b',
            background: '#ffffff',
            padding: '4px 10px',
            borderRadius: '6px',
            border: '1px solid #e2e8f0'
          }}
        >
          {applications.length} Active Profiles
        </span>
      </div>

      <div className="kanban-board">
        {COLUMNS.map((col) => {
          const colApps = applications.filter((app) => {
            const s = app.STATUS || app.status || 'Pending';
            return col.statuses.includes(s);
          });

          return (
            <div className="kanban-col" key={col.id}>
              <div className="kanban-col-header">
                <div className="kanban-col-title">
                  <span className={`col-dot ${col.dotClass}`} />
                  <span>{col.title}</span>
                </div>
                <span className="kanban-col-count">{colApps.length}</span>
              </div>

              <div className="kanban-cards">
                {colApps.length === 0 ? (
                  <div style={{ padding: '24px 10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '11px' }}>
                    No candidates in this stage
                  </div>
                ) : (
                  colApps.map((app) => {
                    const appId = app.APPLICATION_ID || app.application_id;
                    const name = app.FULL_NAME || app.full_name || 'Anonymous';
                    const initTitle =
                      app.INITIATIVE_TITLE ||
                      app.initiative_title ||
                      app.AI_SUGGESTED_INITIATIVE ||
                      app.ai_suggested_initiative ||
                      'General Operations';
                    const statement =
                      app.RAW_STATEMENT ||
                      app.raw_statement ||
                      app.SKILLS ||
                      app.skills ||
                      'Candidate profile submitted';
                    const priority = PRIORITY_MAP[initTitle] || { label: 'Medium', cls: 'priority-medium' };
                    const initials = name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <div
                        key={appId}
                        className="kanban-card"
                        onClick={() => onCardClick && onCardClick(app)}
                      >
                        <div className="kanban-card-title">{name}</div>
                        <div className="kanban-card-sub">{statement}</div>
                        <div className="kanban-card-footer">
                          <span className={`priority-badge ${priority.cls}`}>
                            {priority.label}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                            {initTitle.replace('Project ', '')}
                          </span>
                          <span style={{ fontSize: '10px', color: '#b45309', background: '#fffbeb', padding: '2px 6px', borderRadius: '4px' }}>
                            {Math.floor(Math.random() * 3) + 1}d in stage
                          </span>
                          <div
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--brand-dark)',
                              color: '#fff',
                              fontSize: '10px',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {initials}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
