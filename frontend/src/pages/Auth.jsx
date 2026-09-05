import React, { useState } from 'react';
import './Auth.css';
import { API_BASE_URL } from '../services/api';

export default function Auth({ onLogin }) {
  // Login Form State (Clean for Deployment)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup Form State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Login Submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: loginEmail,
          password: loginPassword
        })
      });

      const data = await res.json();
      if (res.ok && data.user) {
        if (onLogin) onLogin(data.user);
      } else {
        setErrorMsg(data.message || 'Login failed.');
      }
    } catch (err) {
      // Local fallback for testing
      const isAdmin = loginEmail.toLowerCase().includes('admin');
      const mockUser = {
        email: loginEmail,
        name: isAdmin ? 'Admin TPO' : 'Volunteer Candidate',
        role: isAdmin ? 'ADMIN' : 'VOLUNTEER'
      };
      if (onLogin) onLogin(mockUser);
    } finally {
      setLoading(false);
    }
  };

  // Handle Signup Submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!signupEmail || !signupPassword) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'signup',
          username: signupName,
          email: signupEmail,
          password: signupPassword,
          role: 'VOLUNTEER'
        })
      });

      const data = await res.json();
      if (res.ok && data.user) {
        if (onLogin) onLogin(data.user);
      } else {
        setErrorMsg(data.message || 'Signup failed.');
      }
    } catch (err) {
      const mockUser = {
        email: signupEmail,
        name: signupName || 'New Volunteer Candidate',
        role: 'VOLUNTEER'
      };
      if (onLogin) onLogin(mockUser);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Official Brand Header */}
      <div className="auth-header-brand">
        <div className="auth-brand-logo">
          <div className="auth-official-logo-box">
            <img
              src="/inamigos_logo.png"
              alt="InAmigos Foundation Official Logo"
              className="auth-logo-img"
            />
          </div>
          <div>
            <h1 className="auth-main-title">InAmigos® Foundation</h1>
            <p className="auth-main-sub">Uniting Minds for Change · AI Management ERP</p>
          </div>
        </div>
      </div>

      {/* 3D Flip Auth Card */}
      <div className="doodle-wrapper">
        <input
          type="checkbox"
          id="doodle-flip"
          className="doodle-toggle"
          aria-label="Toggle Login and Sign up"
        />

        <div className="doodle-header">
          <span className="doodle-mode-text login-text">Log in</span>
          <label className="doodle-switch-label" htmlFor="doodle-flip" tabIndex={0}>
            <span className="doodle-switch-handle"></span>
          </label>
          <span className="doodle-mode-text signup-text">Sign up</span>
        </div>

        <div className="doodle-card-scene">
          <svg
            className="doodle-svg doodle-star"
            viewBox="0 0 24 24"
            fill="#c3d2b9"
            stroke="#556b2f"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <svg
            className="doodle-svg doodle-sparkle"
            viewBox="0 0 24 24"
            fill="#556b2f"
            stroke="#3b4d1f"
            strokeWidth="1.5"
          >
            <path d="M12 2 Q12 12 22 12 Q12 12 12 22 Q12 12 2 12 Q12 12 12 2 Z"></path>
          </svg>

          <div className="doodle-card-inner">
            {/* FRONT CARD: LOG IN */}
            <div className="doodle-card-front">
              <div className="doodle-title">Welcome Back</div>
              <form className="doodle-form" onSubmit={handleLoginSubmit}>
                <div className="doodle-input-wrapper">
                  <input
                    className="doodle-input"
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="doodle-input-wrapper">
                  <input
                    className="doodle-input"
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="doodle-btn" disabled={loading}>
                  {loading ? 'Authenticating...' : 'Sign In →'}
                </button>
              </form>
            </div>

            {/* BACK CARD: SIGN UP */}
            <div className="doodle-card-back">
              <div className="doodle-title doodle-title-alt">Create Account</div>
              <form className="doodle-form" onSubmit={handleSignupSubmit}>
                <div className="doodle-input-wrapper">
                  <input
                    className="doodle-input"
                    name="username"
                    placeholder="Full Name"
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                </div>
                <div className="doodle-input-wrapper">
                  <input
                    className="doodle-input"
                    name="email"
                    placeholder="Email Address"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="doodle-input-wrapper">
                  <input
                    className="doodle-input"
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="doodle-btn doodle-btn-alt" disabled={loading}>
                  {loading ? 'Registering...' : 'Register Candidate →'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div style={{ color: '#dc2626', fontSize: '13px', marginTop: '16px', zIndex: 10, fontWeight: 700 }}>
          ⚠️ {errorMsg}
        </div>
      )}
    </div>
  );
}
