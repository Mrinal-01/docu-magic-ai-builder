import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('auth_token');
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test credentials
    const testUsers = {
      'admin@docuforge.com': { password: 'admin123', name: 'Admin User', role: 'admin' },
      'user@test.com': { password: 'user123', name: 'Test User', role: 'user' }
    };

    const testUser = testUsers[email as keyof typeof testUsers];
    
    if (testUser && testUser.password === password) {
      const userData: User = {
        id: email === 'admin@docuforge.com' ? 'admin-1' : 'user-1',
        email,
        name: testUser.name,
        createdAt: new Date().toISOString()
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Store auth token
      localStorage.setItem('auth_token', 'dummy-jwt-token');
      
      return;
    }

    throw new Error('Invalid email or password');
  };

  const register = async (email: string, password: string, name: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you'd validate the email isn't already taken
    const userData: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      createdAt: new Date().toISOString()
    };
    
    setUser(userData);
    setIsAuthenticated(true);
    
    // Store auth token
    localStorage.setItem('auth_token', 'dummy-jwt-token');
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
