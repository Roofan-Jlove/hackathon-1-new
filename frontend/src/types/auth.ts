export interface User {
  id: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  programming_experience?: string;
  python_proficiency?: string;
  ros_experience?: string;
  ai_ml_experience?: string;
  robotics_hardware_experience?: string;
  sensor_integration?: string;
  electronics_knowledge?: string;
  primary_interests?: string[];
  time_commitment?: string;
  created_at: string;
  updated_at: string;
}

export interface SignupData {
  email: string;
  password: string;
  profile?: Partial<UserProfile>;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  profile?: UserProfile;
  token: string;
  token_type: string;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  signup: (data: SignupData) => Promise<void>;
  signin: (data: SigninData) => Promise<void>;
  signout: () => void;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  clearError: () => void;
}
