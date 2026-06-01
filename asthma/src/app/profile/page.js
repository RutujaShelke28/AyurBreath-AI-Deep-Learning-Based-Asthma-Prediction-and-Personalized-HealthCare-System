'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import './Profile.css';

export default function ProfilePage() {
  const { user, login } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    asthmaHistory: '',
    healthNotes: '',
    doctorCertificate: '',
    license: '',
    graduationInstitute: '',
    passoutYear: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        age: user.age || '',
        gender: user.gender || '',
        asthmaHistory: user.asthma_history || '',
        healthNotes: user.health_notes || '',
        doctorCertificate: user.doctor_certificate || '',
        license: user.license || '',
        graduationInstitute: user.graduation_institute || '',
        passoutYear: user.passout_year || '',
      });
    } else {
      router.push('/login');
    }
  }, [user, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          ...formData,
          age: formData.age ? parseInt(formData.age, 10) : null,
          passoutYear: formData.passoutYear ? parseInt(formData.passoutYear, 10) : null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedUser = await res.json();
      
      // Update the user context
      login({ ...updatedUser, token: user.token });
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
      
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <Link href="/">
        <button className="btn-secondary" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={16} /> Back to Home
        </button>
      </Link>
      
      <div className="profile-card">
        <div className="profile-header">
          <h1>Edit Profile</h1>
          <p>Update your personal information and health details.</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="0"
                max="120"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>



          {user.role === 'doctor' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="license">Medical License Number</label>
                  <input
                    type="text"
                    id="license"
                    name="license"
                    value={formData.license}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="doctorCertificate">Specialization/Certificate</label>
                  <input
                    type="text"
                    id="doctorCertificate"
                    name="doctorCertificate"
                    value={formData.doctorCertificate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="graduationInstitute">Graduation Institute</label>
                  <input
                    type="text"
                    id="graduationInstitute"
                    name="graduationInstitute"
                    value={formData.graduationInstitute}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="passoutYear">Year of Passing</label>
                  <input
                    type="number"
                    id="passoutYear"
                    name="passoutYear"
                    value={formData.passoutYear}
                    onChange={handleChange}
                    min="1950"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>
            </>
          )}

          {message && (
            <div className={`form-message ${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Save size={18} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
