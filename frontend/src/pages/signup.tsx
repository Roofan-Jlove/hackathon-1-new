import React from 'react';
import Layout from '@theme/Layout';
import { useHistory } from '@docusaurus/router';
import SignupForm from '../components/Auth/SignupForm';

export default function SignupPage() {
  const history = useHistory();

  const handleSuccess = () => {
    // Redirect to home or dashboard after successful signup
    history.push('/');
  };

  const handleSwitchToSignin = () => {
    history.push('/signin');
  };

  return (
    <Layout
      title="Sign Up"
      description="Create an account to get personalized learning recommendations"
    >
      <main style={{ minHeight: '80vh', paddingTop: '2rem' }}>
        <SignupForm
          onSuccess={handleSuccess}
          onSwitchToSignin={handleSwitchToSignin}
        />
      </main>
    </Layout>
  );
}
