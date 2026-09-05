import React, { useState, useEffect } from 'react';
import './SettingsModal.css';

export default function SettingsModal({ isOpen, onClose }) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('inamigos_settings');
    return saved
      ? JSON.parse(saved)
      : {
          aiThreshold: 70,
          autoEmail: true,
          slaHours: 48,
          minHours: 4,
          theme: 'light',
          retentionDays: 90,
          aiModel: 'gemini-2.5-flash'
        };
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('inamigos_settings', JSON.stringify(settings));
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <div>
            <h3>⚙ InAmigos ERP System Settings</h3>
            <p>Configure foundation triage thresholds, notifications, and AI parameters</p>
          </div>
          <button className="settings-close-btn" onClick={onClose}>×</button>
        </div>

        {savedSuccess && (
          <div className="settings-success-alert">
            ✓ Settings updated successfully and saved to local state.
          </div>
        )}

        <div className="settings-body">
          {/* Setting 1: AI Auto-Triage Threshold */}
          <div className="setting-row">
            <div className="setting-info">
              <label>AI Match Confidence Threshold</label>
              <span>Minimum confidence required before auto-triaging candidates</span>
            </div>
            <div className="setting-control flex-align">
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={settings.aiThreshold}
                onChange={(e) => handleChange('aiThreshold', Number(e.target.value))}
              />
              <span className="setting-val-badge">{settings.aiThreshold}%</span>
            </div>
          </div>

          {/* Setting 2: Automatic Email Notifications */}
          <div className="setting-row">
            <div className="setting-info">
              <label>Automated Applicant Email Notifications</label>
              <span>Send instant email updates upon status transitions</span>
            </div>
            <div className="setting-control">
              <label className="switch-toggle">
                <input
                  type="checkbox"
                  checked={settings.autoEmail}
                  onChange={(e) => handleChange('autoEmail', e.target.checked)}
                />
                <span className="slider-round" />
              </label>
            </div>
          </div>

          {/* Setting 3: SLA Breach Alert Target */}
          <div className="setting-row">
            <div className="setting-info">
              <label>Kanban Review SLA Breach Target (Hours)</label>
              <span>Flag cards in Manual Review exceeding this duration</span>
            </div>
            <div className="setting-control">
              <input
                type="number"
                min="12"
                max="120"
                className="setting-input-num"
                value={settings.slaHours}
                onChange={(e) => handleChange('slaHours', Number(e.target.value))}
              />
              <span className="unit-label">hrs</span>
            </div>
          </div>

          {/* Setting 4: Default Minimum Volunteer Hours */}
          <div className="setting-row">
            <div className="setting-info">
              <label>Default Weekly Commitment Requirement</label>
              <span>Minimum required volunteer hours per week</span>
            </div>
            <div className="setting-control">
              <input
                type="number"
                min="1"
                max="40"
                className="setting-input-num"
                value={settings.minHours}
                onChange={(e) => handleChange('minHours', Number(e.target.value))}
              />
              <span className="unit-label">hrs/wk</span>
            </div>
          </div>

          {/* Setting 5: System Display Mode */}
          <div className="setting-row">
            <div className="setting-info">
              <label>ERP Display Theme Mode</label>
              <span>Choose preferred visual appearance</span>
            </div>
            <div className="setting-control">
              <select
                className="setting-select"
                value={settings.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
              >
                <option value="light">Light Mode (Clean Non-Profit)</option>
                <option value="dark">Dark Mode (Beta)</option>
                <option value="system">Follow OS Preference</option>
              </select>
            </div>
          </div>

          {/* Setting 6: Audit Log Retention Period */}
          <div className="setting-row">
            <div className="setting-info">
              <label>Statutory Audit Log Retention</label>
              <span>Compliance retention lifecycle for Oracle audit logs</span>
            </div>
            <div className="setting-control">
              <select
                className="setting-select"
                value={settings.retentionDays}
                onChange={(e) => handleChange('retentionDays', Number(e.target.value))}
              >
                <option value={30}>30 Days (Standard)</option>
                <option value={90}>90 Days (Quarterly Audit)</option>
                <option value={365}>365 Days (1 Year Statutory)</option>
              </select>
            </div>
          </div>

          {/* Setting 7: AI Engine Selection */}
          <div className="setting-row">
            <div className="setting-info">
              <label>Gemini AI Triage Engine Model</label>
              <span>Active LLM engine for structured schema evaluations</span>
            </div>
            <div className="setting-control">
              <select
                className="setting-select"
                value={settings.aiModel}
                onChange={(e) => handleChange('aiModel', e.target.value)}
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fast Triage)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Analysis)</option>
                <option value="local-sim">Offline Rule-based Engine</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>Save Configuration</button>
        </div>
      </div>
    </div>
  );
}
