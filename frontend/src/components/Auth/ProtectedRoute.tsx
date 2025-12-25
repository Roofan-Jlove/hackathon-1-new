import React, { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ children, redirectTo = '/signin' }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (!loading && !user) {
      history.push(redirectTo);
    }
  }, [user, loading, history, redirectTo]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
