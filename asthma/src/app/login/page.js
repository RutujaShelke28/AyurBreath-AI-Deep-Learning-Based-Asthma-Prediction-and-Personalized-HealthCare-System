'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import API from '@/lib/api';
import { Leaf, Eye, EyeOff, Mail, Lock, User, Stethoscope } from 'lucide-react';
import '../Auth.css';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState('patient');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await API.post('/auth/login', { ...form, role });
      const user = res.data.user;
      login({ ...user, token: res.data.token });
      
      if (user.role === 'admin') {
        router.push('/dashboard/admin');
      } else if (user.role === 'doctor') {
        router.push('/dashboard/doctor');
      } else {
        router.push('/dashboard');
      }
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

          <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
            <button type="button" 
              onClick={() => setRole('patient')}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid', background: role === 'patient' ? 'var(--green-50)' : 'white', borderColor: role === 'patient' ? 'var(--green-500)' : 'var(--gray-200)', color: role === 'patient' ? 'var(--green-700)' : 'var(--gray-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
              <User size={18} /> Patient
            </button>
            <button type="button" 
              onClick={() => setRole('doctor')}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid', background: role === 'doctor' ? 'var(--green-50)' : 'white', borderColor: role === 'doctor' ? 'var(--green-500)' : 'var(--gray-200)', color: role === 'doctor' ? 'var(--green-700)' : 'var(--gray-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
              <Stethoscope size={18} /> Doctor
            </button>
            <button type="button" 
              onClick={() => setRole('admin')}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid', background: role === 'admin' ? 'var(--green-50)' : 'white', borderColor: role === 'admin' ? 'var(--green-500)' : 'var(--gray-200)', color: role === 'admin' ? 'var(--green-700)' : 'var(--gray-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
              Admin
            </button>
          </div>

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



          <p className="auth-switch">Don't have an account? <Link href="/register">Create one</Link></p>
        </div>
      </div>
    </div>
  );
}
