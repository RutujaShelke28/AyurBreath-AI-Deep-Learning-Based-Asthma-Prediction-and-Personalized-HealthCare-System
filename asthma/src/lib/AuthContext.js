'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendationsState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage on mount (client-side only)
    const saved = localStorage.getItem('ayur_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse user from local storage');
      }
    }
    const savedRecs = localStorage.getItem('ayur_recs');
    if (savedRecs) {
      try {
        setRecommendationsState(JSON.parse(savedRecs));
      } catch (e) {
        console.error('Failed to parse recs from local storage');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // userData includes { token, ...userFields }
    setUser(userData);
    localStorage.setItem('ayur_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setRecommendationsState(null);
    localStorage.removeItem('ayur_user');
    localStorage.removeItem('ayur_recs');
  };

  const setRecommendations = (recs) => {
    setRecommendationsState(recs);
    if (recs) {
      localStorage.setItem('ayur_recs', JSON.stringify(recs));
    } else {
      localStorage.removeItem('ayur_recs');
    }
  };

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, recommendations, setRecommendations }}>
      {children}
    </AuthContext.Provider>
  );
}
