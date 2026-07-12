import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, predefinedUsers } from '../services/mockData';
import { storage } from '../services/storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (roleName: string) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in local storage
    const storedUser = storage.get<User>('current_user');
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const foundUser = predefinedUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      storage.set('current_user', foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    storage.remove('current_user');
  };

  const switchRole = (roleName: string) => {
    const foundUser = predefinedUsers.find(u => u.role === roleName);
    if (foundUser) {
      setUser(foundUser);
      storage.set('current_user', foundUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, switchRole, isLoading }}>
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
