import React, { useState, useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import Layout from '@theme-original/Layout';
import ChatbotWidget from '@site/src/components/Chatbot/ChatbotWidget';

export default function LayoutWrapper(props) {
  const location = useLocation();

  // Check if we're on a documentation page
  const isDocsPage = location.pathname.startsWith('/docs/');

  // State to track if we're in the browser
  const [isBrowser, setIsBrowser] = useState(false);

  // Set up API configuration after component mounts
  useEffect(() => {
    setIsBrowser(true);
    if (typeof window !== 'undefined') {
      // Get the API base URL from a global configuration
      const apiBaseUrl =
        (window as any).DOCUSAURUS_CONFIG?.API_BASE_URL ||
        'http://localhost:8000';

      (window as any).APP_CONFIG = {
        API_BASE_URL: apiBaseUrl
      };
    }
  }, []);

  return (
    <Layout {...props}>
      {props.children}
      {isDocsPage && isBrowser && <ChatbotWidget />}
    </Layout>
  );
}