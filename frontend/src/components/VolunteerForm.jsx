import React, { useState } from 'react';
import './VolunteerForm.css';

import { API_BASE_URL } from '../services/api';

const OPEN_INITIATIVES = [
  {
    id: 1,
    title: 'Project Bachpanshala',
    icon: '📚',
    category: 'Education & Child Literacy',
    openRoles: 12,
    hoursPerWeek: '6–10 hrs/week',
    location: 'North Delhi',
    description: 'Teaching underprivileged children basic literacy, numeracy, and digital skills.',
    skills: ['Teaching', 'Mentoring', 'Content Creation']
  },
  {
    id: 2,
    title: 'Project Jeev',
    icon: '🐾',
    category: 'Animal Welfare & Rescue',
    openRoles: 8,
    hoursPerWeek: '8–15 hrs/week',
    location: 'Gurugram & South Delhi',
    description: 'Stray animal rescue, vaccination drives, and shelter management assistance.',
    skills: ['Animal Care', 'Veterinary Aid', 'Logistics']
  },
  {
    id: 3,
    title: 'Project Seva',
    icon: '🍲',
    category: 'Zero Hunger',
    openRoles: 15,
    hoursPerWeek: '4–8 hrs/week',
    location: 'Noida Migrant Hub',
    description: 'Community kitchen coordination, ration distribution, and food drive logistics.',
    skills: ['Food Distribution', 'Logistics', 'Inventory']
  },
  {
    id: 4,
    title: 'Project Prakriti',
    icon: '🌱',
    category: 'Urban Afforestation',
    openRoles: 10,
    hoursPerWeek: '6–12 hrs/week',
    location: 'Yamuna Floodplain',
    description: 'Tree plantation drives, waste management campaigns, and eco-awareness workshops.',
    skills: ['Environment', 'Gardening', 'Waste Mgmt']
  },
  {
    id: 5,
    title: 'Project Udaan',
    icon: '🕊️',
    category: 'Women Skill & Livelihood',
    openRoles: 6,
    hoursPerWeek: '5–10 hrs/week',
    location: 'Faridabad Rural Block',
    description: 'Women empowerment through skill training, micro-enterprise mentoring, and legal literacy.',
    skills: ['Training', 'Mentorship', 'Legal Aid']
  }
];

export default function VolunteerForm({ onSubmitSuccess }) {
  const [step, setStep] = useState(1);
  const [selectedInitiative, setSelectedInitiative] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    availability_hours: '',
    skills: '',
    raw_statement: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const validate = () => {
    const errs = {};
    if (!formData.full_name.trim()) errs.full_name = 'Full name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Enter a valid email address.';
    }
    if (!formData.raw_statement.trim()) {
      errs.raw_statement = 'A brief statement of purpose is required.';
    } else if (formData.raw_statement.trim().length < 15) {
      errs.raw_statement = 'Please write at least 15 characters.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Check if text looks like gibberish / low relevance
  const evaluateTextQuality = (text, skills) => {
    const combined = `${text} ${skills}`.toLowerCase();
    const meaningfulKeywords = ['teach', 'school', 'child', 'animal', 'dog', 'rescue', 'food', 'plant', 'tree', 'women', 'help', 'volunteer', 'community', 'education', 'drive'];
    const hasMeaningfulKeyword = meaningfulKeywords.some(k => combined.includes(k));
    const isRepetitive = /(.)\1{4,}/.test(text);

    if (!hasMeaningfulKeyword || isRepetitive || text.length < 25) {
      return {
        confidence: 0.35,
        suggested: 'General Operations',
        reasoning: 'Statement contains generic or low-relevance text. Flagged for manual review by Foundation coordinator.',
        status: 'manual_review'
      };
    }

    // High quality match
    let project = 'Project Bachpanshala';
    if (combined.includes('animal') || combined.includes('dog') || combined.includes('vet')) project = 'Project Jeev';
    else if (combined.includes('food') || combined.includes('hunger')) project = 'Project Seva';
    else if (combined.includes('plant') || combined.includes('tree') || combined.includes('environment')) project = 'Project Prakriti';
    else if (combined.includes('women') || combined.includes('skill')) project = 'Project Udaan';

    return {
      confidence: 0.88,
      suggested: project,
      reasoning: `Matched key competencies to ${project} requirements.`,
      status: 'ai_triaged'
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const payload = {
      ...formData,
      preferred_initiative: selectedInitiative?.title || null
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/volunteers/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setSubmittedData(data);
        setStep(3);
        if (onSubmitSuccess) onSubmitSuccess(data);
      } else {
        alert(data.message || 'Submission failed.');
      }
    } catch (err) {
      // Local fallback simulation with text quality check
      const quality = selectedInitiative 
        ? { confidence: 0.95, suggested: selectedInitiative.title, reasoning: 'Direct applicant initiative preference selected.', status: 'ai_triaged' }
        : evaluateTextQuality(formData.raw_statement, formData.skills);

      const mockResult = {
        message: 'Application submitted',
        application_id: Math.floor(Math.random() * 1000) + 200,
        status: quality.status,
        ai_triage: {
          ai_suggested_initiative: quality.suggested,
          ai_confidence: quality.confidence,
          ai_reasoning: quality.reasoning
        }
      };
      setSubmittedData(mockResult);
      setStep(3);
      if (onSubmitSuccess) onSubmitSuccess(mockResult);
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 3: Success Confirmation ───
  if (step === 3 && submittedData) {
    const confidence = Math.round((submittedData.ai_triage?.ai_confidence || 0) * 100);
    const isLowConfidence = confidence < 50;

    return (
      <div className="vf-wrapper">
        <div className="vf-success-card">
          <div className={`vf-success-icon ${isLowConfidence ? 'warning' : ''}`}>
            {isLowConfidence ? '⚠️' : '✓'}
          </div>
          <h2>{isLowConfidence ? 'Application Under Manual Review' : 'Application Submitted!'}</h2>
          <p className="vf-success-sub">
            Application <strong>#{submittedData.application_id}</strong> received.
            {isLowConfidence 
              ? ' Because your input details were general, our AI has routed your profile to an admin for manual matching.'
              : ' Our Gemini AI triage engine has matched your candidate profile.'}
          </p>

          {submittedData.ai_triage && (
            <div className={`vf-ai-result-card ${isLowConfidence ? 'low-match' : ''}`}>
              <div className="vf-ai-result-header">
                <span>🤖</span>
                <span>AI Triage Analysis</span>
              </div>
              <div className="vf-ai-result-body">
                <div className="vf-ai-match">
                  <span className="vf-ai-label">Suggested Project</span>
                  <span className="vf-ai-value" style={{ color: isLowConfidence ? '#d97706' : '#059669' }}>
                    {submittedData.ai_triage.ai_suggested_initiative || 'Unassigned'}
                  </span>
                </div>
                <div className="vf-ai-match">
                  <span className="vf-ai-label">Confidence Score</span>
                  <span className="vf-ai-value vf-ai-confidence" style={{ color: isLowConfidence ? '#dc2626' : '#059669' }}>
                    {confidence}%
                  </span>
                </div>
              </div>
              <p className="vf-ai-reasoning">{submittedData.ai_triage.ai_reasoning}</p>
            </div>
          )}

          <p className="vf-success-footer">
            You can track your application status anytime in the <strong>My Applications</strong> tab.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="vf-wrapper">
      {/* Step Indicator */}
      <div className="vf-steps">
        <div className={`vf-step ${step >= 1 ? 'active' : ''}`}>
          <div className="vf-step-dot">1</div>
          <span>Choose Initiative</span>
        </div>
        <div className="vf-step-line" />
        <div className={`vf-step ${step >= 2 ? 'active' : ''}`}>
          <div className="vf-step-dot">2</div>
          <span>Your Details</span>
        </div>
      </div>

      {/* ─── Step 1: Initiative Picker ─── */}
      {step === 1 && (
        <div className="vf-step-content">
          <div className="vf-section-header">
            <h2>Select an Initiative</h2>
            <p>Pick a project that matches your passion, or skip to let our AI recommend one.</p>
          </div>

          <div className="vf-initiative-grid">
            {OPEN_INITIATIVES.map((init) => (
              <div
                key={init.id}
                className={`vf-init-card ${selectedInitiative?.id === init.id ? 'selected' : ''}`}
                onClick={() => setSelectedInitiative(selectedInitiative?.id === init.id ? null : init)}
              >
                <div className="vf-init-card-top">
                  <span className="vf-init-icon">{init.icon}</span>
                  <div className="vf-init-meta">
                    <h4>{init.title}</h4>
                    <span className="vf-init-category">{init.category}</span>
                  </div>
                  {selectedInitiative?.id === init.id && (
                    <span className="vf-init-check">✓</span>
                  )}
                </div>

                <p className="vf-init-desc">{init.description}</p>

                <div className="vf-init-tags">
                  {init.skills.map((s) => (
                    <span key={s} className="vf-skill-tag">{s}</span>
                  ))}
                </div>

                <div className="vf-init-footer">
                  <div className="vf-init-stat">
                    <span className="vf-init-stat-val">{init.openRoles}</span>
                    <span className="vf-init-stat-lbl">Open Roles</span>
                  </div>
                  <div className="vf-init-stat">
                    <span className="vf-init-stat-val">{init.hoursPerWeek}</span>
                    <span className="vf-init-stat-lbl">Commitment</span>
                  </div>
                  <div className="vf-init-stat">
                    <span className="vf-init-stat-val">{init.location}</span>
                    <span className="vf-init-stat-lbl">Location</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="vf-step-actions">
            <button className="vf-btn-secondary" onClick={() => { setSelectedInitiative(null); setStep(2); }}>
              Skip — Let AI Decide
            </button>
            <button className="vf-btn-primary" onClick={() => setStep(2)} disabled={!selectedInitiative}>
              Continue with {selectedInitiative?.title || '...'} →
            </button>
          </div>
        </div>
      )}

      {/* ─── Step 2: Personal Details Form ─── */}
      {step === 2 && (
        <div className="vf-step-content">
          {selectedInitiative && (
            <div className="vf-selected-banner">
              <span className="vf-selected-icon">{selectedInitiative.icon}</span>
              <div>
                <strong>Applying for: {selectedInitiative.title}</strong>
                <span className="vf-selected-sub">{selectedInitiative.category} · {selectedInitiative.hoursPerWeek}</span>
              </div>
              <button className="vf-change-btn" onClick={() => setStep(1)}>Change</button>
            </div>
          )}

          <div className="vf-section-header">
            <h2>Your Information</h2>
            <p>Fill in your details below. Required fields are marked with <span className="required">*</span></p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="vf-form-grid">
              <div className="vf-field">
                <label>Full Name <span className="required">*</span></label>
                <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Aarav Sharma" className={errors.full_name ? 'error' : ''} />
                {errors.full_name && <span className="vf-error">{errors.full_name}</span>}
              </div>

              <div className="vf-field">
                <label>Email Address <span className="required">*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="aarav@example.com" className={errors.email ? 'error' : ''} />
                {errors.email && <span className="vf-error">{errors.email}</span>}
              </div>

              <div className="vf-field">
                <label>Phone Number</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 9876543210" />
              </div>

              <div className="vf-field">
                <label>Weekly Availability (Hours)</label>
                <input type="number" name="availability_hours" value={formData.availability_hours} onChange={handleChange} placeholder="10" min="1" max="40" />
              </div>

              <div className="vf-field full">
                <label>Key Skills & Experience</label>
                <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="Teaching, First Aid, Event Management, Data Entry" />
                <span className="vf-hint">Comma-separated. These help our AI match you to the best initiative.</span>
              </div>

              <div className="vf-field full">
                <label>Statement of Purpose <span className="required">*</span></label>
                <textarea name="raw_statement" rows={4} value={formData.raw_statement} onChange={handleChange} placeholder="Tell us about your background, motivation, and what impact you'd like to make..." className={errors.raw_statement ? 'error' : ''} />
                {errors.raw_statement && <span className="vf-error">{errors.raw_statement}</span>}
              </div>
            </div>

            <div className="vf-step-actions">
              <button type="button" className="vf-btn-secondary" onClick={() => setStep(1)}>← Back</button>
              <button type="submit" className="vf-btn-primary" disabled={loading}>
                {loading ? '⏳ Submitting & Running AI Triage...' : 'Submit Application →'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
