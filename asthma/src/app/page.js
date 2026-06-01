'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Leaf, Wind, Brain, Heart, ArrowRight,
  Shield, Zap, ChevronRight, Activity
} from 'lucide-react';
import './Home.css';

const features = [
  { icon: <Brain size={28} />, title: 'AI-Powered Analysis', desc: 'Machine learning models classify asthma severity and identify Dosha imbalances with high accuracy.' },
  { icon: <Leaf size={28} />, title: 'Ayurvedic Wisdom', desc: 'Ancient Vata, Pitta, Kapha profiling combined with modern respiratory science.' },
  { icon: <Wind size={28} />, title: 'Pranayama Guidance', desc: 'Personalized breathing exercises tailored to your specific respiratory condition.' },
  { icon: <Heart size={28} />, title: 'Progress Tracking', desc: 'Monitor symptom trends, breathing comfort, and lifestyle adherence over time.' },
  { icon: <Shield size={28} />, title: 'Secure & Private', desc: 'Email-verified accounts with encrypted health data storage.' },
  { icon: <Zap size={28} />, title: 'Instant Recommendations', desc: 'Get a complete personalized lifestyle plan in seconds after assessment.' },
];

const steps = [
  { num: '01', title: 'Register & Verify', desc: 'Create your account and verify your email to get started.' },
  { num: '02', title: 'Dosha Assessment', desc: 'Answer our structured questionnaire about your lifestyle and symptoms.' },
  { num: '03', title: 'AI Analysis', desc: 'Our AI engine processes your data and classifies severity.' },
  { num: '04', title: 'Get Your Plan', desc: 'Receive a personalized Ayurvedic lifestyle plan tailored to you.' },
];

const doshas = [
  { name: 'Vata', emoji: '🌬️', color: '#e0f2fe', border: '#0ea5e9', text: '#0369a1', desc: 'Air & Space — Governs movement, breathing, and nervous system.' },
  { name: 'Pitta', emoji: '🔥', color: '#fef3c7', border: '#f59e0b', text: '#92400e', desc: 'Fire & Water — Controls metabolism, digestion, and inflammation.' },
  { name: 'Kapha', emoji: '🌊', color: '#dcfce7', border: '#22c55e', text: '#166534', desc: 'Earth & Water — Manages structure, mucus, and immunity.' },
];

const VitalsMonitor = () => {
  const { recommendations } = useAuth();

  const [vitals, setVitals] = useState({
    pulseRate: 72,
    oxygenLevel: 98,
    doshaType: 'Pending...',
    healthScore: 70,
  });
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setVitals(prev => ({
        ...prev,
        pulseRate: Math.floor(Math.random() * (85 - 65 + 1) + 65),
        oxygenLevel: Math.floor(Math.random() * (99 - 95 + 1) + 95),
        healthScore: Math.floor(Math.random() * (90 - 65 + 1) + 65),
      }));
      setTimeout(() => setPulse(false), 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="vitals-monitor-container">
      <div className="vitals-grid">
        <div className="vital-box">
          <Heart size={28} className="vital-icon pulse-icon" />
          <div className={`vital-box-value ${pulse ? 'pulse-text' : ''}`}>{vitals.pulseRate}</div>
          <div className="vital-box-label">Pulse Rate (BPM)</div>
        </div>
        
        <div className="vital-box">
          <Wind size={28} className="vital-icon" />
          <div className={`vital-box-value ${pulse ? 'pulse-text' : ''}`}>{vitals.oxygenLevel}%</div>
          <div className="vital-box-label">Oxygen Level</div>
        </div>
        
        <div className="vital-box">
          <Leaf size={28} className="vital-icon" />
          <div className="vital-box-value">{recommendations?.dosha || vitals.doshaType}</div>
          <div className="vital-box-label">Your Dosha Type</div>
        </div>
        
        <div className="vital-box">
          <Activity size={28} className="vital-icon" />
          <div className={`vital-box-value ${pulse ? 'pulse-text' : ''}`}>{vitals.healthScore}%</div>
          <div className="vital-box-label">Health Score (Good)</div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const { user, recommendations } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role === 'doctor') {
      router.push('/dashboard/doctor');
    } else if (user?.role === 'admin') {
      router.push('/dashboard/admin');
    }
  }, [user, router]);

  if (user?.role === 'doctor') {
    return <div style={{ padding: 100, textAlign: 'center' }}>Loading doctor portal...</div>;
  }
  if (user?.role === 'admin') {
    return <div style={{ padding: 100, textAlign: 'center' }}>Loading admin portal...</div>;
  }

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '35px', fontSize: '1.6rem', fontWeight: '800', color: 'white', fontFamily: '"Playfair Display", serif' }}>
              <div style={{ background: 'var(--green-500)', padding: '6px', borderRadius: '50%', display: 'flex' }}><Leaf size={22} color="white" /></div>
              <span>AyurBreath<span style={{ color: '#a7f3d0' }}>AI</span></span>
            </div>
            <h3 className="hero-subtitle">AYURVEDA MEETS ARTIFICIAL INTELLIGENCE</h3>
            <h1 className="hero-title">
              Personalized Asthma Care Powered by AI
            </h1>
            <p className="hero-desc">
              Discover asthma severity insights and natural wellness recommendations through intelligent health analysis and Ayurvedic guidance.
            </p>
            <div className="hero-actions">
              <Link href={user ? "/assessment" : "/register"}>
                <button className="btn-light">Discover More <ArrowRight size={18} /></button>
              </Link>
            </div>
          </div>
          
          <div className="hero-boxes">
            <VitalsMonitor />
          </div>
        </div>
      </section>

      {/* Dosha Section */}
      <section className="section dosha-section">
        <div className="section-inner">
          <div className="section-header">
            <h2 className="section-title">Understanding Your <span className="gradient-text">Dosha</span></h2>
            <p className="section-sub">Ayurveda identifies three fundamental bio-energies that govern your health and respiratory patterns.</p>
          </div>
          <div className="dosha-grid">
            {doshas.map(d => {
              const isUserDosha = recommendations?.dosha?.toLowerCase() === d.name.toLowerCase();
              return (
              <div key={d.name} className="dosha-card" style={{ 
                background: d.color, 
                borderColor: d.border,
                transform: isUserDosha ? 'scale(1.05)' : 'none',
                boxShadow: isUserDosha ? `0 0 20px ${d.color}` : 'none',
                position: 'relative',
                transition: 'all 0.3s ease'
              }}>
                {isUserDosha && (
                  <div style={{
                    position: 'absolute', top: 12, right: 12, 
                    background: d.text, color: '#fff', 
                    padding: '4px 10px', borderRadius: 20, 
                    fontSize: '0.75rem', fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    Your Dosha
                  </div>
                )}
                <div className="dosha-emoji">{d.emoji}</div>
                <h3 style={{ color: d.text }}>{d.name}</h3>
                <p>{d.desc}</p>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features-section">
        <div className="section-inner">
          <div className="section-header">
            <h2 className="section-title">Everything You Need to <span className="gradient-text">Heal</span></h2>
            <p className="section-sub">A complete digital health companion for asthma patients.</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="section steps-section">
        <div className="section-inner">
          <div className="section-header">
            <h2 className="section-title">How It <span className="gradient-text">Works</span></h2>
            <p className="section-sub">Four simple steps to your personalized Ayurvedic health plan.</p>
          </div>
          <div className="steps-grid">
            {steps.map((s, i) => (
              <div key={i} className="step-card">
                <div className="step-num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                {i < steps.length - 1 && <div className="step-arrow"><ChevronRight size={20} /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2>Ready to Transform Your <span className="gradient-text">Breathing Health?</span></h2>
          <p>Join thousands of asthma patients discovering the power of personalized Ayurvedic care.</p>
          <Link href={user ? '/assessment' : '/register'}>
            <button className="btn-primary cta-btn">
              {user ? 'Start Your Assessment' : 'Create Free Account'} <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">
            <div className="logo-icon"><Leaf size={16} /></div>
            <span>AyurBreath<span className="logo-ai">AI</span></span>
          </div>
          <p>AI-Based Personalized Ayurvedic Lifestyle Framework for Asthma Patients</p>
        </div>
      </footer>
    </div>
  );
}
