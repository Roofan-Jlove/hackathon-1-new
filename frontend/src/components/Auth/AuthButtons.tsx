import React from 'react';
import Link from '@docusaurus/Link';
import { useAuth } from '../../contexts/AuthContext';
import styles from './AuthButtons.module.css';

export default function AuthButtons() {
  const { user, signout, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return (
      <div className={styles.authButtons}>
        <Link to="/profile" className={styles.profileLink}>
          <span className={styles.userEmail}>{user.email}</span>
        </Link>
        <button
          onClick={signout}
          className={styles.signoutButton}
          aria-label="Sign out"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className={styles.authButtons}>
      <Link to="/signin" className={styles.signinLink}>
        Sign In
      </Link>
      <Link to="/signup" className={styles.signupLink}>
        Sign Up
      </Link>
    </div>
  );
}
