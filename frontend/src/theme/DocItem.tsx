import React from 'react';
import DocItem from '@theme-original/DocItem';
import ConditionalChatbot from '../components/Chatbot/ConditionalChatbot';

export default function DocItemWrapper(props) {
  return (
    <>
      <DocItem {...props} />
      <ConditionalChatbot />
    </>
  );
}