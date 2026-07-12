import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  employeeCode: string;
  role: 'ADMIN' | 'ASSET_MANAGER' | 'DEPARTMENT_HEAD' | 'EMPLOYEE';
  companyId: string;
  companyCode: string;
  companyName: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (companyCode: string, employeeCode: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('af_user');
    const token = localStorage.getItem('af_token');
    if (stored && token) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setIsLoading(false);
  }, []);

  const login = async (companyCode: string, employeeCode: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyCode, employeeCode, password }),
      });
      const data = await res.json();
      if (data.success && data.data?.token) {
        localStorage.setItem('af_token', data.data.token);
        const u: AuthUser = {
          id: String(data.data.user.id),
          name: data.data.user.name,
          email: data.data.user.email,
          employeeCode: data.data.user.employeeCode,
          role: data.data.user.role,
          companyId: String(data.data.user.companyId),
          companyCode: data.data.user.companyCode,
          companyName: data.data.user.companyName,
        };
        setUser(u);
        localStorage.setItem('af_user', JSON.stringify(u));
        return true;
      }
    } catch (err) {
      console.error('Login error:', err);
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('af_token');
    localStorage.removeItem('af_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
