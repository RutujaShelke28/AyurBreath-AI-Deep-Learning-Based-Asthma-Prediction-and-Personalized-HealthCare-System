import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Leaf, Wind, Brain, Heart, ArrowRight, CheckCircle,
  Star, Shield, Zap, Users, ChevronRight
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

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-blob blob1" />
          <div className="hero-blob blob2" />
          <div className="hero-blob blob3" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge badge-green"><Leaf size={14} /> Ayurveda + AI</span>
          </div>
          <h1 className="hero-title">
            Breathe Better with<br />
            <span className="gradient-text">Personalized Ayurvedic</span><br />
            Intelligence
          </h1>
          <p className="hero-subtitle">
            An AI-powered platform that combines ancient Ayurvedic wisdom with modern machine learning
            to deliver personalized asthma management plans based on your unique body constitution.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/assessment"><button className="btn-primary hero-btn">Start Assessment <ArrowRight size={18} /></button></Link>
            ) : (
              <>
                <Link to="/register"><button className="btn-primary hero-btn">Get Started Free <ArrowRight size={18} /></button></Link>
                <Link to="/login"><button className="btn-secondary hero-btn">Sign In</button></Link>
              </>
            )}
          </div>
          <div className="hero-stats">
            <div className="stat"><span className="stat-num">3</span><span className="stat-label">Dosha Types</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">95%</span><span className="stat-label">Accuracy</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">50+</span><span className="stat-label">Remedies</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card-float card1">
            <div className="float-icon">🌿</div>
            <div><div className="float-title">Kapha Dominant</div><div className="float-sub">Mucus & Congestion</div></div>
          </div>
          <div className="hero-card-float card2">
            <div className="float-icon">🫁</div>
            <div><div className="float-title">Mild Severity</div><div className="float-sub">AI Classified</div></div>
          </div>
          <div className="hero-orb">
            <div className="orb-inner">
              <Leaf size={60} color="white" />
              <span>AyurBreath AI</span>
            </div>
          </div>
          <div className="hero-card-float card3">
            <div className="float-icon">🧘</div>
            <div><div className="float-title">Pranayama Plan</div><div className="float-sub">Personalized</div></div>
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
            {doshas.map(d => (
              <div key={d.name} className="dosha-card" style={{ background: d.color, borderColor: d.border }}>
                <div className="dosha-emoji">{d.emoji}</div>
                <h3 style={{ color: d.text }}>{d.name}</h3>
                <p>{d.desc}</p>
              </div>
            ))}
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
          <Link to={user ? '/assessment' : '/register'}>
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
          <p className="footer-copy">© 2024 AyurBreath AI — Final Year Engineering Major Project</p>
        </div>
      </footer>
    </div>
  );
}
