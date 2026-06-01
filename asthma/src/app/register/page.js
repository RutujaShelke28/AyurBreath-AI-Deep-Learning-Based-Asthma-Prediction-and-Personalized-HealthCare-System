'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import API from '@/lib/api';
import { Leaf, Eye, EyeOff, User, Mail, Lock, Calendar, ChevronDown } from 'lucide-react';
import '../Auth.css';

export default function Register() {
  const router = useRouter();
  const { login } = useAuth();
  const [role, setRole] = useState('patient');
  const [form, setForm] = useState({ 
    name: '', age: '', email: '', password: '', 
    doctor_certificate: '', license: '', graduation_institute: '', passout_year: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const payload = { ...form, role };
      const res = await API.post('/auth/register', payload);
      
      if (role === 'doctor') {
        setSuccess('Registration successful! Please wait for admin approval before logging in.');
      } else {
        setSuccess('Registration successful! Please log in to continue.');
      }
    } catch (err) {
      if (!err.response) {
        setError('Backend is offline. Please start the backend server.');
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
        <h2>Begin Your Healing Journey</h2>
        <p>Create your account and discover a personalized Ayurvedic lifestyle plan designed specifically for your asthma condition.</p>
        <div className="auth-features">
          {['AI-powered Dosha analysis', 'Personalized diet & yoga plans', 'Symptom progress tracking', 'Secure & private health data'].map(f => (
            <div key={f} className="auth-feature-item">
              <div className="check-icon">✓</div>
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h1>Create Account</h1>
          <p className="auth-sub">Join AyurBreath AI</p>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button 
              type="button"
              className={role === 'patient' ? 'btn-primary' : 'btn-secondary'} 
              style={{ flex: 1, padding: '10px' }}
              onClick={() => setRole('patient')}
            >Patient</button>
            <button 
              type="button"
              className={role === 'doctor' ? 'btn-primary' : 'btn-secondary'} 
              style={{ flex: 1, padding: '10px' }}
              onClick={() => setRole('doctor')}
            >Doctor</button>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && (
            <div className="alert alert-success">
              <div style={{ fontWeight: 700, marginBottom: 4 }}>✅ Registration Successful!</div>
              {success}
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-wrap">
                    <User size={16} className="input-icon" />
                    <input className="input-field" name="name" placeholder="Your full name" value={form.name} onChange={handleChange} required />
                  </div>
                </div>
                {role === 'patient' && (
                  <div className="form-group">
                    <label>Age</label>
                    <div className="input-wrap">
                      <Calendar size={16} className="input-icon" />
                      <input className="input-field" name="age" type="number" placeholder="Age" min="1" max="120" value={form.age} onChange={handleChange} required />
                    </div>
                  </div>
                )}
              </div>



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
                  <input className="input-field" name="password" type={showPass ? 'text' : 'password'} placeholder="Min 8 characters" value={form.password} onChange={handleChange} required minLength={8} />
                  <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>



              {role === 'doctor' && (
                <>
                  <div className="form-group">
                    <label>Doctor Certificate</label>
                    <input className="input-field" name="doctor_certificate" placeholder="Certificate Number or Details" value={form.doctor_certificate} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>License Number</label>
                    <input className="input-field" name="license" placeholder="License Number" value={form.license} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Graduation Institute</label>
                    <input className="input-field" name="graduation_institute" placeholder="Name of Institute" value={form.graduation_institute} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Passout Year</label>
                    <input className="input-field" name="passout_year" type="number" placeholder="YYYY" value={form.passout_year} onChange={handleChange} required />
                  </div>
                </>
              )}

              <button type="submit" className="btn-primary auth-submit" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Create Account'}
              </button>
            </form>
          )}

          <p className="auth-switch">Already have an account? <Link href="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
