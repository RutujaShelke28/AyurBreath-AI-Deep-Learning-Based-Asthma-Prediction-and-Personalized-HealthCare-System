'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { UserCog, Check, X } from 'lucide-react';
import './Requests.css';

export default function DoctorRequests() {
  const { user } = useAuth();
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== 'doctor') {
      router.push('/dashboard');
      return;
    }

    const loadData = async () => {
      try {
        // Fetch all patients
        const res = await fetch('/api/users/patients');
        let allPatients = [];
        if (res.ok) {
          allPatients = await res.json();
          setPatients(allPatients);
        }

        // Load mock consultations
        const stored = JSON.parse(localStorage.getItem('ayur_consultations') || '{}');
        
        // Find which patients have requested this specific doctor
        const incomingRequests = [];
        
        Object.keys(stored).forEach(patientId => {
          const patientConsults = stored[patientId];
          // If this patient requested THIS doctor
          if (patientConsults[user.id]) {
            const patientData = allPatients.find(p => p.id === patientId) || { id: patientId, name: 'Unknown Patient', email: 'Unknown' };
            incomingRequests.push({
              patientId,
              name: patientData.name,
              email: patientData.email,
              status: patientConsults[user.id]
            });
          }
        });

        setRequests(incomingRequests);
      } catch (err) {
        console.error('Failed to load requests', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user, router]);

  const handleAction = (patientId, action) => {
    // action: 'accepted' or 'declined'
    const stored = JSON.parse(localStorage.getItem('ayur_consultations') || '{}');
    
    if (stored[patientId]) {
      if (action === 'declined') {
        delete stored[patientId][user.id]; // Remove request entirely
      } else {
        stored[patientId][user.id] = action;
      }
      localStorage.setItem('ayur_consultations', JSON.stringify(stored));
      
      // Update local state
      if (action === 'declined') {
        setRequests(requests.filter(r => r.patientId !== patientId));
      } else {
        setRequests(requests.map(r => r.patientId === patientId ? { ...r, status: action } : r));
      }
    }
  };

  if (!user || user.role !== 'doctor' || loading) return <div className="requests-page"><div className="requests-container">Loading...</div></div>;

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const activePatients = requests.filter(r => r.status === 'accepted');

  return (
    <div className="requests-page">
      <div className="requests-container">
        <div className="requests-header">
          <h1><UserCog size={32} style={{ display: 'inline', marginRight: 10, color: 'var(--primary-600)', verticalAlign: 'middle' }} /> Patient Requests</h1>
          <p>Review and accept incoming consultation requests from new patients.</p>
        </div>

        <h2 style={{ marginBottom: 20, fontSize: '1.4rem' }}>Pending Requests ({pendingRequests.length})</h2>
        {pendingRequests.length === 0 ? (
          <div className="empty-state">No pending consultation requests at this time.</div>
        ) : (
          pendingRequests.map(req => (
            <div key={req.patientId} className="request-card">
              <div className="patient-info">
                <img 
                  src={`https://ui-avatars.com/api/?name=${req.name}&background=f3f4f6&color=374151&rounded=true`} 
                  alt={req.name} 
                  className="patient-avatar" 
                />
                <div>
                  <h3>{req.name}</h3>
                  <p>{req.email}</p>
                </div>
              </div>
              <div className="request-actions">
                <button 
                  onClick={() => handleAction(req.patientId, 'declined')} 
                  className="btn-secondary" 
                  style={{ borderColor: 'var(--red-200)', color: 'var(--red-600)', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <X size={16} /> Decline
                </button>
                <button 
                  onClick={() => handleAction(req.patientId, 'accepted')} 
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Check size={16} /> Accept Patient
                </button>
              </div>
            </div>
          ))
        )}

        <h2 style={{ marginTop: 50, marginBottom: 20, fontSize: '1.4rem' }}>Active Patients ({activePatients.length})</h2>
        {activePatients.length === 0 ? (
          <div className="empty-state">You haven't accepted any patients yet.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {activePatients.map(req => (
              <div key={req.patientId} className="request-card" style={{ marginBottom: 0 }}>
                <div className="patient-info">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${req.name}&background=EBF3EF&color=4D8770&rounded=true`} 
                    alt={req.name} 
                    className="patient-avatar" 
                  />
                  <div>
                    <h3>{req.name}</h3>
                    <p>{req.email}</p>
                  </div>
                </div>
                <button onClick={() => router.push('/doctor/diet-planner')} className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>
                  Assign Diet
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
