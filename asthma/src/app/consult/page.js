'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { Star, Clock, CheckCircle2, UserPlus, Video } from 'lucide-react';
import './Consult.css';

export default function ConsultDoctor() {
  const { user } = useAuth();
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [consultations, setConsultations] = useState({});
  const [upcomingCall, setUpcomingCall] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchDoctors = async () => {
      try {
        const res = await fetch('/api/users/doctors');
        if (res.ok) {
          const data = await res.json();
          setDoctors(data);
        }
      } catch (err) {
        console.error('Failed to fetch doctors', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();

    // Load mock consultations
    const stored = JSON.parse(localStorage.getItem('ayur_consultations') || '{}');
    if (stored[user.id]) {
      setConsultations(stored[user.id]);
    }

    // Load upcoming call
    const calls = JSON.parse(localStorage.getItem('ayur_telehealth') || '{}');
    if (calls[user.id]) {
      setUpcomingCall(calls[user.id]);
    }
  }, [user, router]);

  const requestConsultation = (doctorId) => {
    const updatedConsultations = { ...consultations, [doctorId]: 'pending' };
    setConsultations(updatedConsultations);
    
    const allStored = JSON.parse(localStorage.getItem('ayur_consultations') || '{}');
    allStored[user.id] = updatedConsultations;
    localStorage.setItem('ayur_consultations', JSON.stringify(allStored));
  };

  if (!user || loading) return <div className="consult-page"><div className="consult-container">Loading...</div></div>;

  return (
    <div className="consult-page">
      <div className="consult-container">
        <div className="consult-header">
          <h1>Find an <span className="gradient-text">Ayurvedic Doctor</span></h1>
          <p>Browse our directory of verified practitioners. Request a consultation to receive a personalized diet and treatment plan.</p>
        </div>

        <div className="doctors-grid">
          {doctors.map(doc => {
            const status = consultations[doc.id];

            return (
              <div key={doc.id} className="doctor-card">
                <img 
                  src={`https://ui-avatars.com/api/?name=${doc.name}&background=EBF3EF&color=4D8770&rounded=true&size=150`} 
                  alt={doc.name} 
                  className="doc-avatar" 
                />
                <h3>{doc.name}</h3>
                <div className="doc-spec">{doc.specialization}</div>
                
                <div className="doc-meta">
                  <span><Clock size={16} /> {doc.experience}</span>
                  <span><Star size={16} color="var(--amber-400)" fill="var(--amber-400)" /> 4.9</span>
                </div>

                {!status && (
                  <button onClick={() => requestConsultation(doc.id)} className="req-btn req-btn-primary">
                    <UserPlus size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} />
                    Request Consultation
                  </button>
                )}
                {status === 'pending' && (
                  <button className="req-btn req-btn-pending" disabled>
                    Pending Approval...
                  </button>
                )}
                {status === 'accepted' && (
                  <button className="req-btn req-btn-accepted" disabled>
                    <CheckCircle2 size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} />
                    Consultation Active
                  </button>
                )}

                {upcomingCall && upcomingCall.doctorId === doc.id && (
                  <div className="telehealth-card-banner">
                    <div className="telehealth-card-info">
                      <Video size={16} />
                      <span>Scheduled: {new Date(upcomingCall.date).toLocaleDateString()} at {upcomingCall.time}</span>
                    </div>
                    <a href={upcomingCall.link} target="_blank" rel="noopener noreferrer" className="join-call-btn-small">
                      Join Video Call
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
