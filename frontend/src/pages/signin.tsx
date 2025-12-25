import React from 'react';
import Layout from '@theme/Layout';
import { useHistory } from '@docusaurus/router';
import SigninForm from '../components/Auth/SigninForm';

export default function SigninPage() {
  const history = useHistory();

  const handleSuccess = () => {
    // Redirect to home or dashboard after successful signin
    history.push('/');
  };

  const handleSwitchToSignup = () => {
    history.push('/signup');
  };

  return (
    <Layout
      title="Sign In"
      description="Sign in to access your personalized learning experience"
    >
      <main style={{ minHeight: '80vh', paddingTop: '2rem' }}>
        <SigninForm
          onSuccess={handleSuccess}
          onSwitchToSignup={handleSwitchToSignup}
        />
      </main>
    </Layout>
  );
}
