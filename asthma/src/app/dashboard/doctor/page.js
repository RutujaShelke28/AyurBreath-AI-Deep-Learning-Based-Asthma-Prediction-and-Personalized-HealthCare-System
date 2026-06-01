'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { Activity, Video, FileText, Utensils } from 'lucide-react';
import './DoctorDashboard.css';

export default function DoctorDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [patientsData, setPatientsData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Telehealth Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [callDetails, setCallDetails] = useState({ date: '', time: '', link: '' });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    } else if (user.role !== 'doctor') {
      router.push('/dashboard');
      return;
    }

    const loadDashboardData = async () => {
      try {
        // 1. Fetch all users to map IDs to names
        const res = await fetch('/api/users/patients');
        let allPatients = [];
        if (res.ok) allPatients = await res.json();

        // 2. Find accepted patients from localStorage
        const storedConsults = JSON.parse(localStorage.getItem('ayur_consultations') || '{}');
        const acceptedIds = [];
        Object.keys(storedConsults).forEach(pId => {
          if (storedConsults[pId][user.id] === 'accepted') {
            acceptedIds.push(pId);
          }
        });

        if (acceptedIds.length === 0) {
          setPatientsData([]);
          setLoading(false);
          return;
        }

        // 3. Fetch their AI Assessment data
        const assessmentRes = await fetch('/api/assessment/patients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patientIds: acceptedIds })
        });
        
        let assessments = [];
        if (assessmentRes.ok) assessments = await assessmentRes.json();

        // 4. Merge data
        const merged = acceptedIds.map(id => {
          const pInfo = allPatients.find(p => p.id === id) || { name: 'Unknown', email: '' };
          const pAnalysis = assessments.find(a => a.user_id === id);
          return {
            id,
            name: pInfo.name,
            email: pInfo.email,
            analysis: pAnalysis || null
          };
        });

        setPatientsData(merged);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user, router]);

  const openTelehealthModal = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleScheduleCall = (e) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const storedCalls = JSON.parse(localStorage.getItem('ayur_telehealth') || '{}');
    
    // Save to the patient's ID so they can see it on their dashboard
    storedCalls[selectedPatient.id] = {
      doctorId: user.id,
      doctorName: user.name,
      ...callDetails
    };
    
    localStorage.setItem('ayur_telehealth', JSON.stringify(storedCalls));
    
    setIsModalOpen(false);
    setSelectedPatient(null);
    setCallDetails({ date: '', time: '', link: '' });
    alert(`Call successfully scheduled with ${selectedPatient.name}!`);
  };

  if (!user || user.role !== 'doctor') return null;

  return (
    <div className="doctor-dash-page">
      <div className="dash-header">
        <Activity size={32} color="var(--primary-600)" />
        <h1>Doctor Dashboard</h1>
      </div>

      <div className="analysis-card">
        <h2>Patient Analysis Data</h2>
        
        {loading ? (
          <p>Loading patient data...</p>
        ) : patientsData.length === 0 ? (
          <p style={{ color: 'var(--gray-500)' }}>You have no active patients. Accept consultation requests to see their data here.</p>
        ) : (
          <div className="analysis-table-wrapper">
            <table className="analysis-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Primary Dosha</th>
                  <th>Asthma Severity</th>
                  <th>AI Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patientsData.map(patient => (
                  <tr key={patient.id}>
                    <td>
                      <div className="patient-cell">
                        <img src={`https://ui-avatars.com/api/?name=${patient.name}&background=f3f4f6&color=374151&size=40`} alt={patient.name} />
                        <div>
                          <span className="patient-name">{patient.name}</span>
                          <span className="patient-email">{patient.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      {patient.analysis ? (
                        <span className={`dosha-badge badge-${patient.analysis.dosha?.toLowerCase() || 'pending'}`}>
                          {patient.analysis.dosha || 'Unknown'}
                        </span>
                      ) : (
                        <span className="dosha-badge badge-pending">Pending Assessment</span>
                      )}
                    </td>
                    <td>
                      {patient.analysis ? (
                        <span className={`severity-${patient.analysis.severity || 'Normal'}`}>
                          {patient.analysis.severity || '-'}
                        </span>
                      ) : '-'}
                    </td>
                    <td>
                      {patient.analysis ? (
                        <strong>{patient.analysis.score}/100</strong>
                      ) : '-'}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-icon" 
                          title="Write Health Report"
                          onClick={() => router.push(`/doctor/reports?patientId=${patient.id}`)}
                        >
                          <FileText size={18} />
                        </button>
                        <button 
                          className="btn-icon" 
                          title="Assign Diet Plan"
                          onClick={() => router.push('/doctor/diet-planner')}
                        >
                          <Utensils size={18} />
                        </button>
                        <button 
                          className="btn-icon" 
                          title="Schedule Video Call"
                          onClick={() => openTelehealthModal(patient)}
                        >
                          <Video size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && selectedPatient && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3><Video size={24} color="var(--primary-600)" /> Schedule Telehealth Call</h3>
            <p style={{ color: 'var(--gray-600)', marginBottom: 20 }}>
              Scheduling a consultation with <strong>{selectedPatient.name}</strong>. Provide a valid video meeting link.
            </p>
            
            <form onSubmit={handleScheduleCall}>
              <label>Date</label>
              <input 
                type="date" 
                required 
                value={callDetails.date}
                onChange={e => setCallDetails({...callDetails, date: e.target.value})}
              />

              <label>Time</label>
              <input 
                type="time" 
                required 
                value={callDetails.time}
                onChange={e => setCallDetails({...callDetails, time: e.target.value})}
              />

              <label>Meeting Link (Zoom / Google Meet)</label>
              <input 
                type="url" 
                placeholder="https://meet.google.com/..." 
                required 
                value={callDetails.link}
                onChange={e => setCallDetails({...callDetails, link: e.target.value})}
              />

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Schedule Call</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
