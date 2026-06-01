'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { Salad, Coffee, Utensils, Apple, Info, CalendarClock, X } from 'lucide-react';
import './DietPlanner.css';

export default function DietPlanner() {
  const { user } = useAuth();
  const router = useRouter();
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullPlan, setShowFullPlan] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Mock DB fetch from localStorage
    const fetchDietPlan = () => {
      const storedPlans = JSON.parse(localStorage.getItem('ayur_doctor_diets') || '{}');
      if (storedPlans[user.id]) {
        setDietPlan(storedPlans[user.id]);
      }
      setLoading(false);
    };

    fetchDietPlan();
  }, [user]);

  if (!user) {
    return (
      <div className="patient-diet-page">
        <div className="diet-container" style={{ textAlign: 'center', marginTop: '100px' }}>
          <h2>Please log in to view your diet plan.</h2>
          <button className="btn-primary mt-4" onClick={() => router.push('/login')}>Log In</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="patient-diet-page"><div className="diet-container">Loading...</div></div>;
  }

  return (
    <div className="patient-diet-page">
      <div className="diet-container">
        <div className="diet-header">
          <h1>Your <span className="gradient-text">Prescribed Diet Plan</span> 🥗</h1>
          <p>Follow the personalized nutritional guidelines assigned by your doctor.</p>
        </div>

        {!dietPlan ? (
          <div className="no-plan-card">
            <CalendarClock size={48} color="var(--gray-400)" style={{ margin: '0 auto' }} />
            <h2>Awaiting Doctor's Prescription</h2>
            <p>Your doctor has not assigned a specific diet plan to your profile yet. Please check back later or contact your doctor.</p>
            <button className="btn-secondary" onClick={() => router.push('/recommendations')}>
              View AI Ayurvedic Diet Meanwhile
            </button>
          </div>
        ) : (
          <div className="diet-grid">
            <div className="diet-card" onClick={() => setShowFullPlan(true)}>
              <div className="diet-card-avatar">
                <Salad size={40} color="var(--green-600)" />
              </div>
              <h3>Dr. {dietPlan.assignedBy}</h3>
              <div className="subtitle">Ayurvedic Diet Plan</div>
              
              <div className="date-badge">
                {new Date(dietPlan.assignedAt).toLocaleDateString('en-US', { 
                  year: 'numeric', month: 'short', day: 'numeric' 
                })}
              </div>
              
              <button className="view-btn">
                View Full Plan
              </button>
            </div>
          </div>
        )}
      </div>

      {showFullPlan && dietPlan && (
        <div className="diet-modal-overlay" onClick={() => setShowFullPlan(false)}>
          <div className="diet-modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setShowFullPlan(false)}>
              <X size={24} />
            </button>

            <div className="plan-details" style={{ margin: 0, border: 'none', boxShadow: 'none' }}>
              <div className="plan-meta">
                <div>
                  Assigned By:
                  <strong>Dr. {dietPlan.assignedBy}</strong>
                </div>
                <div>
                  Date Prescribed:
                  <strong>{new Date(dietPlan.assignedAt).toLocaleDateString()}</strong>
                </div>
              </div>

              <div className="plan-sections">
                <div className="meal-section">
                  <h3><Coffee size={20} color="var(--amber-600)" /> Breakfast</h3>
                  <p>{dietPlan.breakfast}</p>
                </div>

                <div className="meal-section">
                  <h3><Salad size={20} color="var(--green-600)" /> Lunch</h3>
                  <p>{dietPlan.lunch}</p>
                </div>

                <div className="meal-section">
                  <h3><Utensils size={20} color="var(--blue-600)" /> Dinner</h3>
                  <p>{dietPlan.dinner}</p>
                </div>

                {dietPlan.snacks && (
                  <div className="meal-section">
                    <h3><Apple size={20} color="var(--red-500)" /> Snacks & Hydration</h3>
                    <p>{dietPlan.snacks}</p>
                  </div>
                )}

                {dietPlan.notes && (
                  <div className="meal-section notes-section">
                    <h3><Info size={20} /> Special Instructions / Avoid</h3>
                    <p>{dietPlan.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
