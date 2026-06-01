'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { FileText, CalendarClock, X } from 'lucide-react';
import './PatientReports.css';

export default function PatientReports() {
  const { user } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role === 'doctor') {
      router.push('/dashboard/doctor');
      return;
    }

    // Load reports from mock DB
    const storedReports = JSON.parse(localStorage.getItem('ayur_health_reports') || '{}');
    if (storedReports[user.id]) {
      setReports(storedReports[user.id]);
    }
    
    setLoading(false);
  }, [user, router]);

  if (!user || loading) return <div className="patient-reports-page">Loading...</div>;

  return (
    <div className="patient-reports-page">
      <div className="reports-header-box">
        <h1>My <span className="gradient-text">Health Reports</span> 📋</h1>
        <p>Official medical assessments and recommendations from your doctor.</p>
      </div>

      {reports.length === 0 ? (
        <div className="empty-reports">
          <h3>No Reports Yet</h3>
          <p>Your doctor has not generated any health reports for you yet. Check back after your consultation.</p>
        </div>
      ) : (
        <div className="reports-grid">
          {reports.map(report => (
            <div key={report.id} className="report-card" onClick={() => setSelectedReport(report)}>
              <div className="report-card-avatar">
                {report.doctorName?.substring(0, 2).toUpperCase() || 'DR'}
              </div>
              <h3>Dr. {report.doctorName}</h3>
              <div className="subtitle">Clinical Health Report</div>
              
              <div className="date-badge">
                {new Date(report.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', month: 'short', day: 'numeric' 
                })}
              </div>
              
              <button className="view-btn">
                View Full Report
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedReport && (
        <div className="report-modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="report-modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setSelectedReport(null)}>
              <X size={24} />
            </button>
            
            <div className="report-document" style={{ borderTop: 'none', boxShadow: 'none', margin: 0, padding: 0 }}>
              <div className="doc-header">
                <div>
                  <h2>Clinical Health Report</h2>
                  <div className="doc-meta">
                    Prepared by <strong>Dr. {selectedReport.doctorName}</strong>
                  </div>
                </div>
                <div className="doc-date">
                  {new Date(selectedReport.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', month: 'long', day: 'numeric' 
                  })}
                </div>
              </div>

              <div className="doc-section">
                <h4>Clinical Observations</h4>
                <p>{selectedReport.clinicalObservations}</p>
              </div>

              {selectedReport.aiReview && (
                <div className="doc-section">
                  <h4>AI Assessment Review</h4>
                  <p>{selectedReport.aiReview}</p>
                </div>
              )}

              {selectedReport.lifestyleChanges && (
                <div className="doc-section">
                  <h4>Recommended Lifestyle Changes</h4>
                  <p>{selectedReport.lifestyleChanges}</p>
                </div>
              )}

              {selectedReport.medicines && (
                <div className="doc-section">
                  <h4>Prescribed Medicines</h4>
                  <p>{selectedReport.medicines}</p>
                </div>
              )}

              {selectedReport.nextFollowUp && (
                <div className="follow-up-box">
                  <CalendarClock size={20} />
                  Next Follow-Up Date: {new Date(selectedReport.nextFollowUp).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
