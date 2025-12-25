import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Auth.module.css';

interface SigninFormProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
}

export default function SigninForm({ onSuccess, onSwitchToSignup }: SigninFormProps) {
  const { signin, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await signin(formData);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // Error is handled by AuthContext
      console.error('Signin error:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Sign In</h2>
      <p className={styles.formSubtitle}>
        Access your personalized learning experience
      </p>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
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
            Password
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
              placeholder="Enter your password"
              autoComplete="current-password"
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
        </div>

        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {onSwitchToSignup && (
        <div className={styles.switchForm}>
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className={styles.switchButton}
            >
              Sign up
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
