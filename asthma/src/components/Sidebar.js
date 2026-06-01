'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { 
  Home, FileText, Brain, HeartPulse, Pill, LayoutDashboard, Dumbbell, LogOut, Utensils, UserCog, MessageCircle, FileSignature
} from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  // Do not render the sidebar on auth pages or if not logged in
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  if (!user || isAuthPage) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <aside className="global-sidebar">
      <div className="sidebar-profile" ref={dropdownRef}>
        <div 
          className="profile-trigger" 
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <img 
            src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=4D8770&color=FFFFFF&rounded=true&size=60`} 
            alt="Profile" 
          />
          <h3>{user?.name || 'Alisha Chef'}</h3>
          <p>{user?.email || 'alisha@care.com'}</p>
        </div>
        
        {dropdownOpen && (
          <div className="profile-dropdown">
            <Link href="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
              <UserCog size={16} />
              <span>Edit Patient Info</span>
            </Link>
            <button className="dropdown-item text-red" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
      
      <nav className="sidebar-nav">
        {user?.role === 'admin' ? (
          <>
            <Link href="/dashboard/admin" className={`sidebar-link ${pathname === '/dashboard/admin' ? 'active' : ''}`}>
              <LayoutDashboard size={18} className="link-icon" /> Admin Dashboard
            </Link>
          </>
        ) : (
          <>
            <Link href="/" className={`sidebar-link ${pathname === '/' ? 'active' : ''}`}>
              <Home size={18} className="link-icon" /> Home
            </Link>
            
            {user?.role !== 'doctor' && (
              <>
                <Link href="/assessment" className={`sidebar-link ${pathname === '/assessment' ? 'active' : ''}`}>
                  <FileText size={18} className="link-icon" /> Assessment
                </Link>
                <Link href="/prediction" className={`sidebar-link ${pathname === '/prediction' ? 'active' : ''}`}>
                  <Brain size={18} className="link-icon" /> AI Predictions
                </Link>
                <Link href="/recommendations" className={`sidebar-link ${pathname === '/recommendations' ? 'active' : ''}`}>
                  <HeartPulse size={18} className="link-icon" /> Recommendations
                </Link>
              </>
            )}
            
            {user?.role === 'doctor' ? (
              <Link href="/doctor/requests" className={`sidebar-link ${pathname === '/doctor/requests' ? 'active' : ''}`}>
                <UserCog size={18} className="link-icon" /> Patient Requests
              </Link>
            ) : (
              <Link href="/consult" className={`sidebar-link ${pathname === '/consult' ? 'active' : ''}`}>
                <UserCog size={18} className="link-icon" /> Consult Doctor
              </Link>
            )}
            
            {user?.role !== 'doctor' && (
              <Link href="/health-reports" className={`sidebar-link ${pathname === '/health-reports' ? 'active' : ''}`}>
                <FileSignature size={18} className="link-icon" /> Health Reports
              </Link>
            )}
            
            {user?.role === 'doctor' ? (
              <Link href="/doctor/diet-planner" className={`sidebar-link ${pathname === '/doctor/diet-planner' ? 'active' : ''}`}>
                <Utensils size={18} className="link-icon" /> Assign Diet Plan
              </Link>
            ) : (
              <Link href="/diet-planner" className={`sidebar-link ${pathname === '/diet-planner' ? 'active' : ''}`}>
                <Utensils size={18} className="link-icon" /> Diet Planner
              </Link>
            )}
            
            {user?.role !== 'doctor' && (
              <>
                <Link href="/medicines" className={`sidebar-link ${pathname === '/medicines' ? 'active' : ''}`}>
                  <Pill size={18} className="link-icon" /> Medicines
                </Link>
                <Link href="/exercises" className={`sidebar-link ${pathname === '/exercises' ? 'active' : ''}`}>
                  <Dumbbell size={18} className="link-icon" /> Exercises
                </Link>
              </>
            )}
            
            <Link href="/chatbot" className={`sidebar-link ${pathname === '/chatbot' ? 'active' : ''}`}>
              <MessageCircle size={18} className="link-icon" /> Chatbot
            </Link>
            
            <Link href="/dashboard" className={`sidebar-link ${pathname === '/dashboard' ? 'active' : ''}`}>
              <LayoutDashboard size={18} className="link-icon" /> Analysis
            </Link>
          </>
        )}
      </nav>

      <button onClick={handleLogout} className="btn-secondary sidebar-btn" style={{ borderColor: 'var(--gray-200)', color: 'var(--gray-600)', marginTop: 'auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Logout 
        <div className="btn-icon-plus" style={{ background: 'var(--gray-100)', padding: '4px', borderRadius: '6px', display: 'flex' }}>
          <LogOut size={16} color="var(--gray-600)" />
        </div>
      </button>
    </aside>
  );
}
