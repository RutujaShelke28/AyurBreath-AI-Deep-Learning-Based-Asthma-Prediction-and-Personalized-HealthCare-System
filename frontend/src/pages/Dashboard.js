import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Wind, Moon, Activity, Leaf, ArrowRight } from 'lucide-react';
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

  const toggleTask = (i) => setTasks(prev => prev.map((t, idx) => idx === i ? { ...t, done: !t.done } : t));
  const completedCount = tasks.filter(t => t.done).length;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dash-header">
          <div>
            <h1>Health Dashboard</h1>
            <p>Welcome back, <strong>{user?.name}</strong> — Here's your weekly progress</p>
          </div>
          <div className="dash-header-actions">
            {!recommendations && (
              <Link to="/assessment"><button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Take Assessment <ArrowRight size={16} /></button></Link>
            )}
            {recommendations && (
              <div className="dosha-pill">
                {recommendations.dosha === 'Vata' ? '🌬️' : recommendations.dosha === 'Pitta' ? '🔥' : '🌊'}
                {recommendations.dosha} · {recommendations.severity}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="stat-card card">
              <div className="stat-icon" style={{ background: s.color + '20', color: s.color }}>{s.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
              <div className={`stat-change ${s.up ? 'up' : 'down'}`}>
                {s.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {s.change}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="charts-row">
          <div className="chart-card card">
            <h3>Symptom Trends (This Week)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="breathGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="coughGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="breathing" stroke="#22c55e" fill="url(#breathGrad)" strokeWidth={2} name="Breathing" />
                <Area type="monotone" dataKey="cough" stroke="#f59e0b" fill="url(#coughGrad)" strokeWidth={2} name="Cough" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card card">
            <h3>Monthly Improvement %</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="improvement" fill="url(#barGrad)" radius={[6, 6, 0, 0]} name="Improvement %" />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sleep Chart */}
        <div className="chart-card card" style={{ marginBottom: 20 }}>
          <h3>Sleep Quality Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="sleep" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 5 }} name="Sleep Score" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Today's Tasks */}
        <div className="tasks-card card">
          <div className="tasks-header">
            <h3>Today's Ayurvedic Routine</h3>
            <div className="tasks-progress">
              <div className="tasks-progress-bar">
                <div className="tasks-progress-fill" style={{ width: `${(completedCount / tasks.length) * 100}%` }} />
              </div>
              <span>{completedCount}/{tasks.length} completed</span>
            </div>
          </div>
          <div className="tasks-list">
            {tasks.map((t, i) => (
              <div key={i} className={`task-item ${t.done ? 'done' : ''}`} onClick={() => toggleTask(i)}>
                <div className={`task-check ${t.done ? 'checked' : ''}`}>{t.done ? '✓' : ''}</div>
                <div className="task-info">
                  <span className="task-name">{t.task}</span>
                  {t.duration !== '—' && <span className="task-duration">{t.duration}</span>}
                </div>
                <span className="task-time">{t.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
