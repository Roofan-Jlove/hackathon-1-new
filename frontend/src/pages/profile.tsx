import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import ProfileQuestionnaire from '../components/Auth/ProfileQuestionnaire';
import styles from '../components/Auth/Auth.module.css';

function ProfileContent() {
  const { user, profile, updateProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleProfileUpdate = async (profileData: any) => {
    try {
      setError(null);
      await updateProfile(profileData);
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  if (isEditing) {
    return (
      <ProfileQuestionnaire
        onComplete={handleProfileUpdate}
        onSkip={() => setIsEditing(false)}
        onBack={() => setIsEditing(false)}
        loading={loading}
      />
    );
  }

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.formTitle}>My Profile</h1>
      <p className={styles.formSubtitle}>
        Your learning profile helps us personalize content for you
      </p>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          background: 'var(--ifm-color-success-contrast-background)',
          color: 'var(--ifm-color-success)',
          borderRadius: '4px',
          borderLeft: '4px solid var(--ifm-color-success)',
        }}>
          Profile updated successfully!
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <h3>Account Information</h3>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Account Created:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Status:</strong> {user?.is_verified ? 'Verified' : 'Not Verified'}</p>
      </div>

      {profile ? (
        <div>
          <h3>Learning Profile</h3>
          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            {profile.programming_experience && (
              <p><strong>Programming Experience:</strong> {profile.programming_experience}</p>
            )}
            {profile.python_proficiency && (
              <p><strong>Python Proficiency:</strong> {profile.python_proficiency}</p>
            )}
            {profile.ros_experience && (
              <p><strong>ROS Experience:</strong> {profile.ros_experience}</p>
            )}
            {profile.ai_ml_experience && (
              <p><strong>AI/ML Experience:</strong> {profile.ai_ml_experience}</p>
            )}
            {profile.robotics_hardware_experience && (
              <p><strong>Hardware Experience:</strong> {profile.robotics_hardware_experience}</p>
            )}
            {profile.primary_interests && profile.primary_interests.length > 0 && (
              <p><strong>Interests:</strong> {profile.primary_interests.join(', ')}</p>
            )}
            {profile.time_commitment && (
              <p><strong>Time Commitment:</strong> {profile.time_commitment}</p>
            )}
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className={styles.submitButton}
          >
            Update Profile
          </button>
        </div>
      ) : (
        <div>
          <p style={{ marginBottom: '1rem' }}>
            You haven't completed your learning profile yet. Complete it to get personalized recommendations!
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className={styles.submitButton}
          >
            Complete Profile
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Layout
      title="Profile"
      description="Manage your learning profile"
    >
      <main style={{ minHeight: '80vh', paddingTop: '2rem' }}>
        <ProtectedRoute>
          <ProfileContent />
        </ProtectedRoute>
      </main>
    </Layout>
  );
}
