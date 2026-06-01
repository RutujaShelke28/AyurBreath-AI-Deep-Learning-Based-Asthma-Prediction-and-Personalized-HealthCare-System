'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Mail } from 'lucide-react';
import '../Auth.css';

export default function EmailVerification() {
  const params = useSearchParams();
  const status = params.get('status');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)', padding: '20px' }}>
      <div className="auth-card" style={{ textAlign: 'center', maxWidth: 460 }}>
        {status === 'success' ? (
          <>
            <div style={{ width: 80, height: 80, background: 'var(--green-100)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--green-600)' }}>
              <CheckCircle size={40} />
            </div>
            <h1 style={{ marginBottom: 12 }}>Email Verified! 🎉</h1>
            <p style={{ color: 'var(--gray-500)', marginBottom: 28, lineHeight: 1.7 }}>
              Your account has been successfully verified. You can now sign in and start your personalized Ayurvedic health journey.
            </p>
            <Link href="/login">
              <button className="btn-primary" style={{ width: '100%', padding: '14px' }}>Sign In Now</button>
            </Link>
          </>
        ) : (
          <>
            <div style={{ width: 80, height: 80, background: '#fef3c7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#d97706' }}>
              <Mail size={40} />
            </div>
            <h1 style={{ marginBottom: 12 }}>Check Your Email 📬</h1>
            <p style={{ color: 'var(--gray-500)', marginBottom: 16, lineHeight: 1.7 }}>
              We've sent a verification link to your email address. Please click the link to activate your account before logging in.
            </p>
            <div className="alert alert-success" style={{ textAlign: 'left', marginBottom: 16 }}>
              ✉️ Verification email sent! Check your inbox and spam folder.
            </div>
            <p style={{ color: 'var(--gray-400)', fontSize: 13, marginBottom: 20 }}>
              The link expires in 24 hours.
            </p>
            <Link href="/login">
              <button className="btn-secondary" style={{ width: '100%', padding: '12px' }}>Back to Login</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
