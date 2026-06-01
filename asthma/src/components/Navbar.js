'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { Leaf, Menu, X, LogOut } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { 
    logout(); 
    router.push('/'); 
  };

  if (user) return null;

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <Link href="/" className="nav-logo">
          <div className="logo-icon"><Leaf size={20} /></div>
          <span>AyurBreath<span className="logo-ai">AI</span></span>
        </Link>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {user && <>
            <Link href="/assessment" className={pathname === '/assessment' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Assessment</Link>
            <Link href="/prediction" className={pathname === '/prediction' ? 'active' : ''} onClick={() => setMenuOpen(false)}>AI Prediction</Link>
            <Link href="/recommendations" className={pathname === '/recommendations' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Recommendations</Link>
            <Link href="/dashboard" className={pathname === '/dashboard' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Dashboard</Link>
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
              <Link href="/login"><button className="btn-secondary">Login</button></Link>
              <Link href="/register"><button className="btn-primary">Get Started</button></Link>
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
