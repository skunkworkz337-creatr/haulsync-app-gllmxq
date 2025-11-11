
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Customer, Hauler } from '@/types/user';

interface AuthContextType {
  user: User | Customer | Hauler | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | Customer | Hauler | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // In a real app, check AsyncStorage or SecureStore for session
      // For now, simulate loading
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoading(false);
    } catch (error) {
      console.log('Error checking auth status:', error);
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // In a real app, call your authentication API
      console.log('Login attempt:', email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser: User = {
        id: '1',
        email,
        role: 'customer',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
      };
      
      setUser(mockUser);
    } catch (error) {
      console.log('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear session storage
      setUser(null);
    } catch (error) {
      console.log('Logout error:', error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      console.log('Register attempt:', userData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create user based on role
      if (userData.role === 'hauler') {
        const newHauler: Hauler = {
          id: Date.now().toString(),
          email: userData.email,
          role: 'hauler',
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          createdAt: new Date(),
          status: 'pending_background_check',
          subscriptionTier: 'free',
        };
        setUser(newHauler);
      } else {
        const newCustomer: Customer = {
          id: Date.now().toString(),
          email: userData.email,
          role: 'customer',
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          createdAt: new Date(),
        };
        setUser(newCustomer);
      }
    } catch (error) {
      console.log('Registration error:', error);
      throw error;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) return;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser({ ...user, ...userData });
    } catch (error) {
      console.log('Update user error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        updateUser,
      }}
    >
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
