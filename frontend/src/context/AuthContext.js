import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ayur_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [recommendations, setRecommendations] = useState(null);

  const login = (userData) => {
    // userData includes { token, ...userFields }
    setUser(userData);
    localStorage.setItem('ayur_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ayur_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, recommendations, setRecommendations }}>
      {children}
    </AuthContext.Provider>
  );
}
