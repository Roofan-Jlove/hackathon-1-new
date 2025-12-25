import React, { useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import ChatbotWidget from './ChatbotWidget';

const ConditionalChatbot: React.FC = () => {
  const location = useLocation();

  // Only show chatbot on documentation pages, not on homepage
  const isDocsPage = location.pathname.startsWith('/docs/');

  if (isDocsPage) {
    return <ChatbotWidget />;
  }

  return null;
};

export default ConditionalChatbot;