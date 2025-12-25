import React, {type ReactNode, useState, useEffect} from 'react';
import { useLocation } from '@docusaurus/router';
import Layout from '@theme-original/Layout';
import type LayoutType from '@theme/Layout';
import type {WrapperProps} from '@docusaurus/types';
import ChatbotWidget from '@site/src/components/Chatbot/ChatbotWidget';

type Props = WrapperProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props): ReactNode {
  const location = useLocation();
  const isDocsPage = location.pathname.startsWith('/docs/');
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
    if (typeof window !== 'undefined') {
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
