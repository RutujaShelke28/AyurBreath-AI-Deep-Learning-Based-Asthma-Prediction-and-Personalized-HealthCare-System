'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import API from '@/lib/api';
import { Shield, CheckCircle, XCircle, User, FileText, Calendar } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [approvedDoctors, setApprovedDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'admin') {
      router.push('/dashboard');
    } else {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/users');
      setPendingDoctors(res.data.pendingDoctors || []);
      setApprovedDoctors(res.data.approvedDoctors || []);
      setPatients(res.data.patients || []);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await API.post(`/admin/doctors/${id}/approve`);
      const approvedDoc = pendingDoctors.find(d => d.id === id);
      setPendingDoctors(pendingDoctors.filter(d => d.id !== id));
      if (approvedDoc) {
        setApprovedDoctors([...approvedDoctors, approvedDoc]);
      }
      alert('Doctor approved successfully!');
    } catch (err) {
      alert('Failed to approve doctor.');
    }
  };

  const [view, setView] = useState('dashboard');

  if (!user || user.role !== 'admin') return null;

  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <Shield size={32} color="#0066cc" />
        <h1 style={{ margin: 0, color: '#333' }}>Admin Dashboard</h1>
      </div>

      {view === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', alignItems: 'stretch' }}>
          
          <div 
            onClick={() => setView('pendingDoctors')}
            style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', cursor: 'pointer', border: '1px solid #eaeaea', transition: 'transform 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h2 style={{ marginTop: 0, marginBottom: '10px', fontSize: '1.2rem', color: '#555' }}>Pending Doctor Registrations</h2>
            {loading ? <p>Loading...</p> : (
              <p style={{ fontSize: '2rem', margin: '10px 0', color: '#0066cc', fontWeight: 'bold' }}>{pendingDoctors.length}</p>
            )}
            <p style={{ color: '#888', margin: 0 }}>Click to view & approve</p>
          </div>

          <div 
            onClick={() => setView('approvedDoctors')}
            style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', cursor: 'pointer', border: '1px solid #eaeaea', transition: 'transform 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h2 style={{ marginTop: 0, marginBottom: '10px', fontSize: '1.2rem', color: '#555' }}>Approved Doctors</h2>
            {loading ? <p>Loading...</p> : (
              <p style={{ fontSize: '2rem', margin: '10px 0', color: '#4caf50', fontWeight: 'bold' }}>{approvedDoctors.length}</p>
            )}
            <p style={{ color: '#888', margin: 0 }}>Click to view all registered doctors</p>
          </div>

          <div 
            onClick={() => setView('patients')}
            style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', cursor: 'pointer', border: '1px solid #eaeaea', transition: 'transform 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h2 style={{ marginTop: 0, marginBottom: '10px', fontSize: '1.2rem', color: '#555' }}>Registered Patients</h2>
            {loading ? <p>Loading...</p> : (
              <p style={{ fontSize: '2rem', margin: '10px 0', color: '#ff9800', fontWeight: 'bold' }}>{patients.length}</p>
            )}
            <p style={{ color: '#888', margin: 0 }}>Click to view all active patients</p>
          </div>
        </div>
      )}

      {view !== 'dashboard' && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <button 
            onClick={() => setView('dashboard')}
            style={{ background: 'transparent', border: 'none', color: '#0066cc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', padding: '0', marginBottom: '20px', fontSize: '1rem' }}
          >
            ← Back to Dashboard
          </button>
          
          {view === 'pendingDoctors' && (
            <>
              <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.5rem', color: '#333' }}>Pending Doctor Registrations</h2>
              {pendingDoctors.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                  <CheckCircle size={48} color="#4caf50" style={{ marginBottom: '16px' }} />
                  <p>All caught up! No pending registrations.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                  {pendingDoctors.map(doctor => (
                    <div key={doctor.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#fafafa' }}>
                      <div>
                        <h3 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <User size={18} /> {doctor.name}
                        </h3>
                        <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}><strong>Email:</strong> {doctor.email}</p>
                        <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={16} /> <strong>Certificate:</strong> {doctor.doctor_certificate}</p>
                        <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={16} /> <strong>License:</strong> {doctor.license}</p>
                        <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16} /> <strong>Institute:</strong> {doctor.graduation_institute} ({doctor.passout_year})</p>
                      </div>
                      <button onClick={() => handleApprove(doctor.id)} style={{ background: '#4caf50', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', marginTop: 'auto' }}>
                        <CheckCircle size={18} /> Approve
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {view === 'approvedDoctors' && (
            <>
              <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.5rem', color: '#333' }}>Approved Doctors</h2>
              {approvedDoctors.length === 0 ? (
                <p style={{ color: '#888' }}>No approved doctors yet.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                  {approvedDoctors.map(doctor => (
                    <div key={doctor.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '16px', background: '#fafafa' }}>
                      <h3 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><User size={18} /> {doctor.name}</h3>
                      <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#666' }}>{doctor.email}</p>
                      <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#666' }}>License: {doctor.license}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {view === 'patients' && (
            <>
              <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.5rem', color: '#333' }}>Registered Patients</h2>
              {patients.length === 0 ? (
                <p style={{ color: '#888' }}>No registered patients yet.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                  {patients.map(patient => (
                    <div key={patient.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '16px', background: '#fafafa' }}>
                      <h3 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><User size={18} /> {patient.name}</h3>
                      <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#666' }}>{patient.email}</p>
                      <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#666' }}>Age: {patient.age || '-'} | Gender: {patient.gender || '-'}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
