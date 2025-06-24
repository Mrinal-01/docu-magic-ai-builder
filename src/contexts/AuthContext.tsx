import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  first_name?: string;
  last_name?: string;
  createdAt: string;
  subscription_status?: 'free' | 'premium' | 'enterprise';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  googleLogin: () => Promise<void>;
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

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
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
          first_name: testUser.name.split(' ')[0],
          last_name: testUser.name.split(' ')[1] || '',
          createdAt: new Date().toISOString(),
          subscription_status: email === 'admin@docuforge.com' ? 'enterprise' : 'free'
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        
        // Store auth token
        localStorage.setItem('auth_token', 'dummy-jwt-token');
        
        return;
      }

      throw new Error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string): Promise<void> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you'd validate the email isn't already taken
      const userData: User = {
        id: `user-${Date.now()}`,
        email,
        name: `${firstName} ${lastName}`,
        first_name: firstName,
        last_name: lastName,
        createdAt: new Date().toISOString(),
        subscription_status: 'free'
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Store auth token
      localStorage.setItem('auth_token', 'dummy-jwt-token');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
  };

  const googleLogin = async (): Promise<void> => {
    setLoading(true);
    try {
      // Simulate Google OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful Google authentication
      const userData: User = {
        id: `google-${Date.now()}`,
        email: 'user@gmail.com',
        name: 'Google User',
        first_name: 'Google',
        last_name: 'User',
        createdAt: new Date().toISOString(),
        subscription_status: 'free'
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('auth_token', 'google-jwt-token');
    } catch (error) {
      throw new Error('Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading, 
      login, 
      register, 
      logout, 
      googleLogin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
