'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'anomia-auth-status';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedStatus = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (storedStatus === 'loggedIn') {
      setIsLoggedIn(true);
    }
  }, []);

  const login = (user: string, pass: string) => {
    // Hardcoded credentials: user 'Klebersoncesare@gmail.com', password 'klebsu123'
    if (user === 'Klebersoncesare@gmail.com' && pass === 'klebsu123') {
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'loggedIn');
      setIsLoggedIn(true);
      return true;
    }
    setIsLoggedIn(false);
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
