'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { ClipboardList, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import './DoctorDiet.css';

export default function DoctorDietPlanner() {
  const { user } = useAuth();
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState('');
  
  const [dietPlan, setDietPlan] = useState({
    breakfast: '',
    lunch: '',
    dinner: '',
    snacks: '',
    notes: ''
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Only allow doctors
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
    } else {
      setLoading(false);
    }
  }, [user, router]);

  const handleChange = (e) => {
    setDietPlan({ ...dietPlan, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPatient) {
      setStatus('Please select a patient.');
      return;
    }

    // Save to localStorage as our mock DB
    const storedPlans = JSON.parse(localStorage.getItem('ayur_doctor_diets') || '{}');
    storedPlans[selectedPatient] = {
      ...dietPlan,
      assignedBy: user.name,
      assignedAt: new Date().toISOString()
    };
    localStorage.setItem('ayur_doctor_diets', JSON.stringify(storedPlans));

    setStatus('success');
    
    // Clear form after a short delay
    setTimeout(() => {
      setStatus('');
      setSelectedPatient('');
      setDietPlan({ breakfast: '', lunch: '', dinner: '', snacks: '', notes: '' });
    }, 3000);
  };

  if (!user) {
    return (
      <div className="doctor-diet-page">
        <div className="doctor-container" style={{ textAlign: 'center', marginTop: '100px' }}>
          <h2>Please log in to access this page.</h2>
        </div>
      </div>
    );
  }

  if (user.role !== 'doctor') return null;

  return (
    <div className="doctor-diet-page">
      <div className="doctor-container">
        <div className="doctor-header">
          <h1><ClipboardList size={32} style={{ display: 'inline', marginRight: 10, color: 'var(--primary-600)', verticalAlign: 'middle' }} /> Assign Diet Plan</h1>
          <p>Create personalized dietary guidelines for your patients.</p>
        </div>

        <div className="doctor-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="patientSelect">Select Patient</label>
              <select 
                id="patientSelect"
                className="patient-select"
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                required
              >
                <option value="">-- Choose a Patient --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.email})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Breakfast Recommendations</label>
              <textarea 
                className="diet-textarea" 
                name="breakfast"
                placeholder="E.g., Warm oatmeal with cinnamon and stewed apples..."
                value={dietPlan.breakfast}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Lunch Recommendations</label>
              <textarea 
                className="diet-textarea" 
                name="lunch"
                placeholder="E.g., Quinoa with steamed asparagus and moong dal..."
                value={dietPlan.lunch}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Dinner Recommendations</label>
              <textarea 
                className="diet-textarea" 
                name="dinner"
                placeholder="E.g., Light vegetable soup, avoid heavy dairy..."
                value={dietPlan.dinner}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Snacks & Hydration</label>
              <textarea 
                className="diet-textarea" 
                name="snacks"
                placeholder="E.g., Ginger tea, warm water, soaked almonds..."
                value={dietPlan.snacks}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Additional Notes / Avoid</label>
              <textarea 
                className="diet-textarea" 
                name="notes"
                placeholder="E.g., Strictly avoid cold items, yogurt at night, and processed sugar."
                value={dietPlan.notes}
                onChange={handleChange}
              />
            </div>

            {status === 'success' && (
              <div className="success-message">
                <CheckCircle2 size={20} />
                Diet plan successfully assigned to patient!
              </div>
            )}
            {status && status !== 'success' && (
              <div className="success-message" style={{ backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#ef4444' }}>
                <AlertTriangle size={20} />
                {status}
              </div>
            )}

            <button type="submit" className="btn-primary submit-btn">
              Assign Diet Plan <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
