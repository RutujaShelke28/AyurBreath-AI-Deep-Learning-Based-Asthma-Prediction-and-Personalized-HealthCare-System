import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Menu, X, LogOut, LayoutDashboard, ClipboardList } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <div className="logo-icon"><Leaf size={20} /></div>
          <span>AyurBreath<span className="logo-ai">AI</span></span>
        </Link>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Home</Link>
          {user && <>
            <Link to="/assessment" className={location.pathname === '/assessment' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Assessment</Link>
            <Link to="/prediction" className={location.pathname === '/prediction' ? 'active' : ''} onClick={() => setMenuOpen(false)}>AI Prediction</Link>
            <Link to="/recommendations" className={location.pathname === '/recommendations' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Recommendations</Link>
            <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Dashboard</Link>
          </>}
        </div>

        <div className="nav-actions">
          {user ? (
            <div className="user-menu">
              <div className="user-avatar">{user.name?.[0]?.toUpperCase() || 'U'}</div>
              <span className="user-name">{user.name}</span>
              <button className="btn-icon" onClick={handleLogout} title="Logout"><LogOut size={18} /></button>
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login"><button className="btn-secondary">Login</button></Link>
              <Link to="/register"><button className="btn-primary">Get Started</button></Link>
            </div>
          )}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
