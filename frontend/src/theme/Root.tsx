import React, { useEffect } from 'react';
import Root from '@theme-original/Root';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { AuthProvider } from '../contexts/AuthContext';

export default function RootWrapper(props) {
  const { siteConfig } = useDocusaurusContext();
  const { apiBaseUrl } = siteConfig.customFields as { apiBaseUrl: string };

  useEffect(() => {
    // Inject the config into the window object so the chatbot can access it
    if (typeof window !== 'undefined') {
      (window as any).APP_CONFIG = {
        API_BASE_URL: apiBaseUrl,
      };
    }
  }, [apiBaseUrl]);

  return (
    <AuthProvider>
      <Root {...props} />
    </AuthProvider>
  );
}
