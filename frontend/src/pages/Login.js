import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { Leaf, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await API.post('/auth/login', form);
      login({ ...res.data.user, token: res.data.token });
      navigate('/');
    } catch (err) {
      if (!err.response) {
        setError('Backend is offline. Please start the backend server.');
      } else {
        setError(err.response?.data?.message || 'Login failed. Check your credentials.');
      }
    } finally { setLoading(false); }
  };

  const handleDemo = () => {
    login({
      id: 'demo_local',
      name: 'Demo User',
      email: 'demo@ayurbreath.ai',
      token: 'demo-local-token',
    });
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="logo-icon"><Leaf size={24} /></div>
          <span className="auth-brand-name">AyurBreath<span className="logo-ai">AI</span></span>
        </div>
        <h2>Welcome Back</h2>
        <p>Sign in to access your personalized Ayurvedic health dashboard and continue your wellness journey.</p>
        <div className="auth-visual">
          <div className="auth-dosha-cards">
            {[{e:'🌬️',n:'Vata'},{e:'🔥',n:'Pitta'},{e:'🌊',n:'Kapha'}].map(d => (
              <div key={d.n} className="mini-dosha-card">
                <span>{d.e}</span>
                <span>{d.n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h1>Sign In</h1>
          <p className="auth-sub">Access your personalized health dashboard</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrap">
                <Mail size={16} className="input-icon" />
                <input className="input-field" name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrap">
                <Lock size={16} className="input-icon" />
                <input className="input-field" name="password" type={showPass ? 'text' : 'password'} placeholder="Your password" value={form.password} onChange={handleChange} required />
                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <Eye size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary auth-submit" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Sign In'}
            </button>
          </form>

          <button type="button" className="btn-secondary demo-btn" onClick={handleDemo} style={{ marginTop: 12 }}>
            Try Demo (no backend required)
          </button>

          <p className="auth-switch">Don't have an account? <Link to="/register">Create one</Link></p>
        </div>
      </div>
    </div>
  );
}
