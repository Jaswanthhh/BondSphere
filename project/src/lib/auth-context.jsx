import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check localStorage on initial load
    const storedAuth = localStorage.getItem('isLoggedIn');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (email) => {
    setIsAuthenticated(true);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 