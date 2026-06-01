'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { FileSignature, CheckCircle2, Send } from 'lucide-react';
import './DoctorReports.css';

export default function DoctorReports() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedPatient = searchParams.get('patientId');

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(preSelectedPatient || '');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  const [reportData, setReportData] = useState({
    clinicalObservations: '',
    aiReview: '',
    lifestyleChanges: '',
    medicines: '',
    nextFollowUp: ''
  });

  useEffect(() => {
    if (user && user.role !== 'doctor') {
      router.push('/dashboard');
      return;
    }

    const fetchPatients = async () => {
      try {
        const res = await fetch('/api/users/patients');
        if (res.ok) {
          const allPatients = await res.json();
          // Filter by accepted consultations
          const stored = JSON.parse(localStorage.getItem('ayur_consultations') || '{}');
          const acceptedPatients = allPatients.filter(p => {
             const patientConsults = stored[p.id];
             return patientConsults && patientConsults[user.id] === 'accepted';
          });
          setPatients(acceptedPatients);
        }
      } catch (err) {
        console.error('Failed to fetch patients', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPatients();
    }
  }, [user, router]);

  const handleChange = (e) => {
    setReportData({ ...reportData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const storedReports = JSON.parse(localStorage.getItem('ayur_health_reports') || '{}');
    
    // Store array of reports per patient to keep history
    if (!storedReports[selectedPatient]) {
      storedReports[selectedPatient] = [];
    }

    storedReports[selectedPatient].unshift({
      id: 'rep_' + Date.now(),
      doctorId: user.id,
      doctorName: user.name,
      createdAt: new Date().toISOString(),
      ...reportData
    });

    localStorage.setItem('ayur_health_reports', JSON.stringify(storedReports));

    setStatus('success');
    setTimeout(() => {
      setStatus('');
      setSelectedPatient('');
      setReportData({
        clinicalObservations: '',
        aiReview: '',
        lifestyleChanges: '',
        medicines: '',
        nextFollowUp: ''
      });
      router.push('/dashboard/doctor');
    }, 2500);
  };

  if (!user || user.role !== 'doctor') return null;

  return (
    <div className="doctor-reports-page">
      <div className="reports-header">
        <h1><FileSignature size={32} color="var(--primary-600)" /> Generate Health Report</h1>
        <p>Write an official medical assessment and share it directly with your patient.</p>
      </div>

      <div className="report-card">
        <form className="report-form" onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Select Patient</label>
            <select 
              className="report-select"
              value={selectedPatient}
              onChange={e => setSelectedPatient(e.target.value)}
              required
            >
              <option value="">-- Choose a Patient --</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.email})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Clinical Observations</label>
            <textarea 
              className="report-textarea" 
              name="clinicalObservations"
              placeholder="E.g., Patient exhibits signs of high Vata imbalance with dry cough..."
              value={reportData.clinicalObservations}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>AI Assessment Review</label>
            <textarea 
              className="report-textarea" 
              name="aiReview"
              placeholder="E.g., I concur with the AI's assessment of Vata dosha, however the severity..."
              value={reportData.aiReview}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Recommended Lifestyle Changes</label>
            <textarea 
              className="report-textarea" 
              name="lifestyleChanges"
              placeholder="E.g., Avoid cold environments, practice Pranayama daily..."
              value={reportData.lifestyleChanges}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Prescribed Ayurvedic Medicines (Optional)</label>
            <textarea 
              className="report-textarea" 
              name="medicines"
              placeholder="E.g., Sitopaladi Churna (1 tsp with honey twice a day)..."
              value={reportData.medicines}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Next Follow-Up Date</label>
            <input 
              type="date"
              className="report-select"
              name="nextFollowUp"
              value={reportData.nextFollowUp}
              onChange={handleChange}
            />
          </div>

          {status === 'success' && (
            <div className="success-message">
              <CheckCircle2 size={20} />
              Health Report generated and sent to patient successfully!
            </div>
          )}

          <button type="submit" className="btn-primary submit-report-btn">
            Generate & Send Report <Send size={20} />
          </button>

        </form>
      </div>
    </div>
  );
}
