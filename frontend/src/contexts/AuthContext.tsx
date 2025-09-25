import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { loginUser, registerUser } from '../services/authService';
import { LoginData, RegisterData, UserType } from '../types';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: UserType | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
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

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (data: LoginData) => {
    setLoading(true);
    try {
      const { token } = await loginUser(data);
      
      // Decode the JWT token to get user information
      const decoded = jwtDecode<{ email: string; role: 'customer' | 'provider'; sub: string }>(token);
      
      const user: UserType = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role
      };
      
      setToken(token);
      setUser(user);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    try {
      // Register the user first
      const { message } = await registerUser(data);
      console.log('Registration successful:', message);
      
      // After registration, automatically log in
      await login({ email: data.email, password: data.password });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};