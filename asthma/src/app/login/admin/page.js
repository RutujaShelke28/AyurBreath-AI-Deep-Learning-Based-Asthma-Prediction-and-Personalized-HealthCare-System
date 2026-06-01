'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import API from '@/lib/api';
import { Shield, Eye, Mail, Lock } from 'lucide-react';
import '../../Auth.css';

export default function AdminLogin() {
  const router = useRouter();
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
      const res = await API.post('/auth/login', { ...form, role: 'admin' });
      const user = res.data.user;
      
      if (user.role !== 'admin') {
        setError('Unauthorized: You are not an admin.');
        setLoading(false);
        return;
      }

      login({ ...user, token: res.data.token });
      router.push('/dashboard/admin');
    } catch (err) {
      if (!err.response) {
        setError('Backend is offline. Please start the backend server.');
      } else {
        setError(err.response?.data?.message || 'Login failed. Check your credentials.');
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-left" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
        <div className="auth-brand">
          <div className="logo-icon" style={{ background: 'rgba(255,255,255,0.1)' }}><Shield size={24} /></div>
          <span className="auth-brand-name">AyurBreath<span className="logo-ai" style={{ color: '#38bdf8' }}>AI</span></span>
        </div>
        <h2>Admin Portal</h2>
        <p>Sign in to access the administrative dashboard and manage system resources.</p>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h1>Admin Sign In</h1>
          <p className="auth-sub">Secure access to the administration panel</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Admin Email</label>
              <div className="input-wrap">
                <Mail size={16} className="input-icon" />
                <input className="input-field" name="email" type="email" placeholder="admin@example.com" value={form.email} onChange={handleChange} required />
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

            <button type="submit" className="btn-primary auth-submit" disabled={loading} style={{ background: '#0f172a', borderColor: '#0f172a' }}>
              {loading ? <span className="spinner" /> : 'Secure Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
