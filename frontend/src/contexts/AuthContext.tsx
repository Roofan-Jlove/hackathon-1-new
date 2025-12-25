import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../utils/api';
import type {
  AuthContextType,
  AuthState,
  SignupData,
  SigninData,
  UserProfile,
  AuthResponse,
} from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const PROFILE_KEY = 'auth_profile';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    token: null,
    loading: true,
    error: null,
  });

  // Load saved auth data on mount
  useEffect(() => {
    const loadAuthData = () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY);
        const userStr = localStorage.getItem(USER_KEY);
        const profileStr = localStorage.getItem(PROFILE_KEY);

        if (token && userStr) {
          const user = JSON.parse(userStr);
          const profile = profileStr ? JSON.parse(profileStr) : null;

          setState({
            user,
            profile,
            token,
            loading: false,
            error: null,
          });

          // Optionally verify token is still valid
          api.getCurrentUser(token)
            .then((currentUser) => {
              setState(prev => ({ ...prev, user: currentUser as any }));
            })
            .catch(() => {
              // Token invalid, clear auth
              clearAuth();
            });
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    loadAuthData();
  }, []);

  const saveAuth = (token: string, user: any, profile: any) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (profile) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    }

    setState({
      user,
      profile,
      token,
      loading: false,
      error: null,
    });
  };

  const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(PROFILE_KEY);

    setState({
      user: null,
      profile: null,
      token: null,
      loading: false,
      error: null,
    });
  };

  const signup = async (data: SignupData) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await api.signup(data) as AuthResponse;
      saveAuth(response.token, response.user, response.profile);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  };

  const signin = async (data: SigninData) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await api.signin(data) as AuthResponse;
      saveAuth(response.token, response.user, response.profile);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signin failed';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  };

  const signout = () => {
    if (state.token) {
      api.signout(state.token).catch(console.error);
    }
    clearAuth();
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!state.token) {
      throw new Error('Not authenticated');
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const updatedProfile = await api.updateProfile(profileData, state.token) as UserProfile;

      localStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile));
      setState(prev => ({
        ...prev,
        profile: updatedProfile,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const value: AuthContextType = {
    ...state,
    signup,
    signin,
    signout,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
