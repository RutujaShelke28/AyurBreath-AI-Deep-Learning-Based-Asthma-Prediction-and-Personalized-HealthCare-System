'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Wind, Moon, Activity, Leaf, ArrowRight,
  LayoutDashboard, Home, FileText, Brain, HeartPulse, Pill, Plus,
  Search, Folder, Mail, Bell, Video
} from 'lucide-react';
import './Dashboard.css';

const weeklyData = [
  { day: 'Mon', cough: 4, breathing: 5, sleep: 6, yoga: 0 },
  { day: 'Tue', cough: 3, breathing: 6, sleep: 7, yoga: 1 },
  { day: 'Wed', cough: 3, breathing: 7, sleep: 7, yoga: 1 },
  { day: 'Thu', cough: 2, breathing: 7, sleep: 8, yoga: 1 },
  { day: 'Fri', cough: 2, breathing: 8, sleep: 8, yoga: 1 },
  { day: 'Sat', cough: 1, breathing: 8, sleep: 9, yoga: 1 },
  { day: 'Sun', cough: 1, breathing: 9, sleep: 9, yoga: 1 },
];

const monthlyData = [
  { week: 'Week 1', improvement: 10 },
  { week: 'Week 2', improvement: 28 },
  { week: 'Week 3', improvement: 45 },
  { week: 'Week 4', improvement: 67 },
];

const stats = [
  { label: 'Breathing Score', value: '8.5/10', change: '+2.3', up: true, icon: <Wind size={22} />, color: '#0ea5e9' },
  { label: 'Sleep Quality', value: '8.2/10', change: '+1.8', up: true, icon: <Moon size={22} />, color: '#8b5cf6' },
  { label: 'Cough Frequency', value: '1.2/day', change: '-2.8', up: false, icon: <Activity size={22} />, color: '#f59e0b' },
  { label: 'Yoga Adherence', value: '85%', change: '+15%', up: true, icon: <Leaf size={22} />, color: '#22c55e' },
];

const todayTasks = [
  { time: '6:00 AM', task: 'Kapalabhati Pranayama', duration: '10 min', done: true },
  { time: '7:00 AM', task: 'Warm tulsi ginger tea', duration: '—', done: true },
  { time: '8:00 AM', task: 'Steam inhalation', duration: '10 min', done: false },
  { time: '12:00 PM', task: 'Light warm lunch', duration: '—', done: false },
  { time: '5:00 PM', task: 'Evening yoga session', duration: '20 min', done: false },
  { time: '9:00 PM', task: 'Steam inhalation + Nasya oil', duration: '15 min', done: false },
];

export default function Dashboard() {
  const { user, recommendations } = useAuth();
  const [tasks, setTasks] = useState(todayTasks);

  useEffect(() => {
    if (user && user.role === 'admin') {
      window.location.href = '/dashboard/admin';
    } else if (user && user.role === 'doctor') {
      window.location.href = '/dashboard/doctor';
    }
  }, [user]);

  const toggleTask = (i) => setTasks(prev => prev.map((t, idx) => idx === i ? { ...t, done: !t.done } : t));
  const completedCount = tasks.filter(t => t.done).length;

  return (
    <div className="dashboard-page">
      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Navbar */}
        <div className="dash-topbar">
          <div className="topbar-actions">
            <Link href="/profile">
              <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <FileText size={14} /> Edit Patient Info
              </button>
            </Link>
            <Bell size={20} className="topbar-icon" />
            <img src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=EBF3EF&color=4D8770&rounded=true&size=40`} alt="User" style={{ borderRadius: '50%' }} />
          </div>
        </div>

        <div className="dashboard-container">
          <div className="dash-header">
            <div>
              <h1>Analysis</h1>
            </div>
            <div className="dash-header-actions">
              {!recommendations && (
                <Link href="/assessment"><button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Take Assessment <ArrowRight size={16} /></button></Link>
              )}
              {recommendations && (
                <div className="dosha-pill">
                  {recommendations.dosha === 'Vata' ? '🌬️' : recommendations.dosha === 'Pitta' ? '🔥' : '🌊'}
                  {recommendations.dosha} · {recommendations.severity}
                </div>
              )}
            </div>
          </div>



          <div className="charts-row">
            <div className="chart-card card" style={{ flex: 2 }}>
              <h3>Progress (This Week)</h3>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="breathGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--green-500)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--green-500)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--amber-400)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--amber-400)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--gray-400)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--gray-400)' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="breathing" stroke="var(--green-500)" fill="url(#breathGrad)" strokeWidth={3} name="Breathing" />
                  <Area type="monotone" dataKey="sleep" stroke="var(--amber-400)" fill="url(#sleepGrad)" strokeWidth={3} name="Sleep" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3>Overall Progress</h3>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="week" tick={{ fontSize: 12, fill: 'var(--gray-400)' }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="improvement" fill="var(--green-400)" radius={[10, 10, 10, 10]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="stat-card card">
                <div className="stat-icon" style={{ background: 'var(--green-100)', color: 'var(--green-600)' }}>{s.icon}</div>
                <div className="stat-info">
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="charts-row">
            <div className="tasks-card card">
              <div className="tasks-header">
                <h3>Client Messages / Today's Routine</h3>
                <div className="tasks-progress">
                  <div className="tasks-progress-bar">
                    <div className="tasks-progress-fill" style={{ width: `${(completedCount / tasks.length) * 100}%` }} />
                  </div>
                  <span>{completedCount}/{tasks.length}</span>
                </div>
              </div>
              <div className="tasks-list">
                {tasks.slice(0, 4).map((t, i) => (
                  <div key={i} className={`task-item ${t.done ? 'done' : ''}`} onClick={() => toggleTask(i)}>
                    <div className={`task-check ${t.done ? 'checked' : ''}`}>{t.done ? '✓' : ''}</div>
                    <div className="task-info">
                      <span className="task-name">{t.task}</span>
                    </div>
                    <span className="task-time">{t.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-card card" style={{ padding: '24px 0' }}>
              <h3 style={{ padding: '0 24px' }}>Current Projects</h3>
              <div className="project-table">
                <div className="table-header">
                  <span>Clients</span>
                  <span>Service</span>
                  <span>Progress</span>
                </div>
                {['Health Assessment', 'Diet Plan', 'Breathing Exercises'].map((p, i) => (
                  <div className="table-row" key={i}>
                    <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{p}</span>
                    <span style={{ color: 'var(--gray-500)', fontSize: 13 }}>Consultation</span>
                    <div className="mini-progress-bar">
                      <div className="mini-progress-fill" style={{ width: `${Math.random() * 60 + 30}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
