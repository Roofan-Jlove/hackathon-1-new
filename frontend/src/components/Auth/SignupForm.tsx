import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProfileQuestionnaire from './ProfileQuestionnaire';
import styles from './Auth.module.css';

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToSignin?: () => void;
}

export default function SignupForm({ onSuccess, onSwitchToSignin }: SignupFormProps) {
  const { signup, loading, error, clearError } = useAuth();
  const [step, setStep] = useState<'credentials' | 'profile'>('credentials');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [profileData, setProfileData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one digit';
    }
    return null;
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setPasswordError('');

    // Validate password
    const pwdError = validatePassword(formData.password);
    if (pwdError) {
      setPasswordError(pwdError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    // Move to profile step
    setStep('profile');
  };

  const handleProfileComplete = async (profile: any) => {
    try {
      await signup({
        email: formData.email,
        password: formData.password,
        profile,
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // Error is handled by AuthContext
      console.error('Signup error:', err);
      // Go back to credentials step on error
      setStep('credentials');
    }
  };

  const handleProfileSkip = async () => {
    try {
      await signup({
        email: formData.email,
        password: formData.password,
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Signup error:', err);
      setStep('credentials');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Clear password error when user types
    if (passwordError && (e.target.name === 'password' || e.target.name === 'confirmPassword')) {
      setPasswordError('');
    }
  };

  if (step === 'profile') {
    return (
      <ProfileQuestionnaire
        onComplete={handleProfileComplete}
        onSkip={handleProfileSkip}
        onBack={() => setStep('credentials')}
        loading={loading}
      />
    );
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Sign Up</h2>
      <p className={styles.formSubtitle}>
        Create an account to get personalized learning recommendations
      </p>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {passwordError && (
        <div className={styles.errorMessage}>
          {passwordError}
        </div>
      )}

      <form onSubmit={handleCredentialsSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.input}
            placeholder="your.email@example.com"
            autoComplete="email"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Password *
          </label>
          <div className={styles.passwordContainer}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="Min. 8 characters, 1 uppercase, 1 digit"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.passwordToggle}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          <small className={styles.hint}>
            Must be at least 8 characters with 1 uppercase letter and 1 digit
          </small>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Confirm Password *
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className={styles.input}
            placeholder="Re-enter your password"
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
        >
          Continue to Profile
        </button>
      </form>

      {onSwitchToSignin && (
        <div className={styles.switchForm}>
          <p>
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignin}
              className={styles.switchButton}
            >
              Sign in
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
